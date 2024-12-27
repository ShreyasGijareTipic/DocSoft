<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\CompanyInfo;

class InvoiceCustomizationController extends Controller
{  
    // public function get(Request $request)
    // {
    //     $companyId = $request->query('company_id');
    
    //     // Retrieve the company information by the provided company_id
    //     $data = CompanyInfo::where('company_id', $companyId)->first();
    
    //     if ($data) {
    //         return response()->json([
    //             'message' => 'Company info retrieved successfully',
    //             'data' => $data
    //         ], 200);
    //     } else {
    //         return response()->json([
    //             'message' => 'Company info not found'
    //         ], 404);
    //     }
    // }
    


    public function store(Request $request)
    {
        $request->validate([
            'land_mark' => 'required|string|max:255',
            'Tal' => 'required|string|max:255',
            'Dist' => 'required|string|max:255',
            'Pincode' => 'required|integer',
            'phone_no' => 'required|',
            'bank_name' => 'required|string|max:255',
            'account_no' => 'required|string|max:255',
            'IFSC' => 'required|string|max:255',
            'logo' => 'string',
            'sign' => 'string',
        ]);

        // $logoPath = $request->file('logo')->store('logos', 'public');
        // $signPath = $request->file('sign')->store('signs', 'public');

        // CompanyInfo::create([
        //     'land_mark' => $request->land_mark,
        //     'Tal' => $request->Tal,
        //     'Dist' => $request->Dist,
        //     'Pincode' => $request->Pincode,
        //     'phone_no' => $request->phone_no,
        //     'bank_name' => $request->bank_name,
        //     'account_no' => $request->account_no,
        //     'IFSC' => $request->IFSC,
        //     'logo' => $logoPath,
        //     'sign' => $signPath,
        // ]);

        $CompanyInfo = new CompanyInfo;
        $CompanyInfo->company_name = "Samarth Nursary 2";
        $CompanyInfo->company_id = 10;
        $CompanyInfo->land_mark = $request->input('land_mark');
        $CompanyInfo->tal = $request->input('Tal');
        $CompanyInfo->dist = $request->input('Dist');
        $CompanyInfo->pincode = $request->input('Pincode');
        $CompanyInfo->phone_no = $request->input('phone_no');
        $CompanyInfo->bank_name = $request->input('bank_name');
        $CompanyInfo->account_no = $request->input('account_no');
        $CompanyInfo->ifsc_code = $request->input('IFSC');
        $CompanyInfo->logo = $request->input('logo');
        $CompanyInfo->sign = $request->input('sign');
        $CompanyInfo->block_status = 1;

        
        $CompanyInfo->save();
        
        // ]);


        return response()->json(['message' => 'Company info saved successfully'], 200);
    }
}
