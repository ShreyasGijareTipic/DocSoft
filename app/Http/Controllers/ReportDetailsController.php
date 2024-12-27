<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\Models\SpareParts;
use App\Models\Report;
use App\Models\ReportDetails;

class ReportDetailsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'report_id' => 'required|exists:reports,id',
            'created_by' => 'required|integer',
            'nature_complaint' => 'nullable|string',
            'actual_fault' => 'nullable|string',
            'action_taken' => 'nullable|string',
            'remark' => 'nullable|integer',
            'customer_suggestion' => 'nullable|string',
            'signature_by' => 'required|string',
            'signature' => 'required|string',
           
        ]);

        $reportDetail = ReportDetails::create($request->all());
        

        return response()->json(['data' => $reportDetail], 201);
    }

    public function getByReportId($report_id)
    {
        $reportDetails = ReportDetails::where('report_id', $report_id)->get();

        return response()->json(['data' => $reportDetails], 200);
    }



  
}
