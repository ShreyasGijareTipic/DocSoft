<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CsvUploadController extends Controller
{
 public function uploadCsv(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:csv,txt|max:2048',
            'table' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $table = $request->input('table');

        // Check if table exists
        if (!Schema::hasTable($table)) {
            return response()->json(['error' => 'Table does not exist'], 404);
        }

        // Get the file
        $file = $request->file('file');
        $path = $file->getRealPath();
        $fileData = array_map('str_getcsv', file($path));
        $header = array_shift($fileData);

        // Get the columns in the table
        $columns = Schema::getColumnListing($table);

        // Filter out columns that don't exist in the table
        $validColumns = array_intersect($header, $columns);

        // Check if at least one column matches
        if (empty($validColumns)) {
            return response()->json(['error' => 'No valid columns found in CSV that match the table columns'], 400);
        }

        // Insert data into the table
        foreach ($fileData as $row) {
            // Combine only the valid columns and their corresponding data
            $data = array_intersect_key(array_combine($header, $row), array_flip($validColumns));

            // Add default value for missing fields
            foreach ($columns as $column) {
                if (!isset($data[$column]) && $column !== 'id') {
                    if ($column === 'created_by') {
                        $data[$column] = Auth::id(); // Add current user ID for 'created_by'
                    } elseif ($column === 'created_at') {
                        $data[$column] = now()->format('Y-m-d H:i:s'); // Add current timestamp for 'created_at'
                    } else {
                        $data[$column] = null; // Or set to an empty string, default image URL, etc.
                    }
                }
            }

            DB::table($table)->insert($data);
        }

        return response()->json(['success' => 'File uploaded and data inserted successfully']);
    }}
