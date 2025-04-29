<?php
namespace App\Http\Controllers;

use App\Models\Drug;
use App\Models\DrugDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CsvUploadController extends Controller
{
     /**
     * Handle CSV upload and store data into the database.
     */
    // public function uploadDrugs(Request $request)
    // {
    //     $request->validate([
    //         'csv_file' => 'required|mimes:csv,txt|max:2048',
    //     ]);

    //     $file = $request->file('csv_file');
    //     $fileHandle = null;

    //     Log::info('Request received:', $request->all());

    //     // Check if the file is present
    //     if (!$request->hasFile('csv_file')) {
    //         return response()->json(['error' => 'The csv file field is required.'], 422);
    //     }

    //     try {
    //         $fileHandle = fopen($file, 'r');
    //         if (!$fileHandle) {
    //             throw new \Exception('Failed to open the CSV file.');
    //         }

    //         // Start a database transaction
    //         DB::beginTransaction();

    //         // Get the logged-in doctor's ID
    //         $doctorId = Auth::id();
    //         if (!$doctorId) {
    //             throw new \Exception('You must be logged in as a doctor to upload drugs.');
    //         }

    //         // Read the header row
    //         $headers = fgetcsv($fileHandle);
    //         if ($headers === false) {
    //             throw new \Exception('Failed to read the header row of the CSV.');
    //         }

    //         // Map header to table columns
    //         $headerMap = array_flip([
    //             'drug_name',
    //             // 'generic_name',
    //             'category',
    //             'manufacturer',
    //             // 'dosage_form',
    //             'strength',
    //             'price',
    //             'stock_quantity',
    //             'expiration_date',
    //             // 'side_effects',
    //             // 'usage_instructions',
    //             // 'storage_conditions',
    //         ]);

    //         // Read data rows and insert them
    //         while (($row = fgetcsv($fileHandle)) !== false) {
    //             if (count($row) < count($headerMap)) {
    //                 throw new \Exception('Invalid data in CSV row: ' . implode(',', $row));
    //             }

    //             // Insert into `drugs` table
    //             $drug = Drug::create([
    //                 'doctor_id'     => $doctorId, // Set the doctor_id for the logged-in doctor
    //                 'drug_name'     => $row[$headerMap['drug_name']],
    //                 // 'generic_name'  => $row[$headerMap['generic_name']],
    //                 'category'      => $row[$headerMap['category']],
    //                 'manufacturer'  => $row[$headerMap['manufacturer']],
    //             ]);

    //             // Convert the expiration date from d-m-Y to Y-m-d format using Carbon
    //             $expirationDate = Carbon::createFromFormat('d-m-Y', $row[$headerMap['expiration_date']])->format('Y-m-d');

    //             // Insert into `drugs_details` table
    //             DrugDetail::create([
    //                 'drug_id'            => $drug->id,
    //                 // 'dosage_form'        => $row[$headerMap['dosage_form']],
    //                 'strength'           => $row[$headerMap['strength']],
    //                 'price'              => $row[$headerMap['price']],
    //                 'stock_quantity'     => $row[$headerMap['stock_quantity']],
    //                 'expiration_date'    => $expirationDate, // Use the converted expiration date
    //                 // 'side_effects'       => $row[$headerMap['side_effects']],
    //                 // 'usage_instructions' => $row[$headerMap['usage_instructions']],
    //                 // 'storage_conditions' => $row[$headerMap['storage_conditions']],
    //             ]);
    //         }

    //         // Commit the database transaction
    //         DB::commit();

    //         return response()->json(['message' => 'CSV data uploaded successfully!'], 201);
    //     } catch (\Exception $e) {
    //         // Rollback the database transaction in case of error
    //         DB::rollBack();

    //         // Log the exception message for debugging
    //         Log::error('Drug upload error: ' . $e->getMessage());

    //         // Close the file handle if it was opened
    //         if ($fileHandle && is_resource($fileHandle)) {
    //             fclose($fileHandle);
    //         }

    //         return response()->json(['error' => 'Failed to upload data: ' . $e->getMessage()], 422);
    //     }
    // }


    public function uploadDrugs(Request $request)
{
    $request->validate([
        'csv_file' => 'required|mimes:csv,txt|max:2048',
    ]);

    if (!$request->hasFile('csv_file')) {
        return response()->json(['error' => 'CSV file is required.'], 422);
    }

    $file = $request->file('csv_file');
    $fileHandle = fopen($file, 'r');
    if (!$fileHandle) {
        return response()->json(['error' => 'Failed to open CSV file.'], 500);
    }

    DB::beginTransaction();

    try {
        $doctorId = Auth::id();
        if (!$doctorId) {
            throw new \Exception('User must be logged in as a doctor.');
        }

        $headers = fgetcsv($fileHandle);
        if ($headers === false) {
            throw new \Exception('Invalid or empty CSV header.');
        }

        // Clean headers (trim spaces)
        $headers = array_map('trim', $headers);
        $headerIndex = array_flip($headers);

        // Check for mandatory columns
        foreach (['drug_name', 'strength'] as $mandatoryColumn) {
            if (!isset($headerIndex[$mandatoryColumn])) {
                throw new \Exception("Missing mandatory column: $mandatoryColumn");
            }
        }

        while (($row = fgetcsv($fileHandle)) !== false) {
            // Validate mandatory fields
            $drugName = trim($row[$headerIndex['drug_name']] ?? '');
            $strength = trim($row[$headerIndex['strength']] ?? '');

            if (empty($drugName) || empty($strength)) {
                throw new \Exception('Mandatory fields (drug_name or strength) are missing in a row.');
            }

            // Insert into `drugs` table
            $drug = Drug::create([
                'doctor_id'    => $doctorId,
                'drug_name'    => $drugName,
                'category'     => $row[$headerIndex['category']] ?? '',
                'manufacturer' => $row[$headerIndex['manufacturer']] ?? '',
            ]);

            // Handle expiration date (optional)
            $expirationDateRaw = $row[$headerIndex['expiration_date']] ?? '';
            $expirationDate = null;
            if (!empty($expirationDateRaw)) {
                try {
                    $expirationDate = Carbon::createFromFormat('d-m-Y', $expirationDateRaw)->format('Y-m-d');
                } catch (\Exception $e) {
                    $expirationDate = null;
                }
            }

            // Insert into `drug_details` table
            DrugDetail::create([
                'drug_id'         => $drug->id,
                'strength'        => $strength,
                'price'           => $row[$headerIndex['price']] ?? '',
                'stock_quantity'  => $row[$headerIndex['stock_quantity']] ?? '',
                'expiration_date' => $expirationDate,
            ]);
        }

        DB::commit();
        fclose($fileHandle);
        return response()->json(['message' => 'CSV data uploaded successfully!'], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        if ($fileHandle && is_resource($fileHandle)) {
            fclose($fileHandle);
        }
        Log::error('Drug upload error: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to upload data: ' . $e->getMessage()], 422);
    }
}

}
