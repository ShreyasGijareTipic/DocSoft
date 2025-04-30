<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\ClinicReceipt;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ClinicReceiptController extends Controller
{
    /**
     * Store a newly created receipt in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinic_id' => 'nullable|exists:clinic_info,clinic_id', // Changed to nullable
            'plan_id' => 'required|exists:plans,id',
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric',
            'valid_till' => 'required|date',
            'transaction_id' => 'nullable|string',
            'transaction_status' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            // Create the receipt
            $receipt = ClinicReceipt::create($request->all());

            // Update the clinic's subscription details - but only if clinic_id is provided
            if ($request->has('clinic_id') && $request->clinic_id) {
                $clinic = Clinic::where('clinic_id', $request->clinic_id)->first();
                if ($clinic) {
                    $clinic->subscribed_plan = $request->plan_id;
                    $clinic->subscription_validity = $request->valid_till;
                    $clinic->save();
                }
            }

            DB::commit();

            // Get receipt with related data - but handle cases where clinic_id might be null
            if ($request->has('clinic_id') && $request->clinic_id) {
                // Full receipt data with clinic info
                $data = DB::table('clinic_receipts as cr')
                    ->join('clinic_info as ci', 'cr.clinic_id', '=', 'ci.clinic_id')
                    ->join('plans as p', 'cr.plan_id', '=', 'p.id')
                    ->join('users as u', 'cr.user_id', '=', 'u.id')
                    ->select(
                        'cr.id as receipt_id',
                        'cr.transaction_id',
                        'cr.transaction_status',
                        'cr.total_amount',
                        'cr.valid_till',
                        'cr.created_at',
                        'ci.clinic_name',
                        'ci.clinic_registration_no',
                        'ci.clinic_mobile',
                        'ci.clinic_address',
                        'p.name as plan_name',
                        'p.price as plan_price',
                        'u.name as user_name'
                    )
                    ->where('cr.id', $receipt->id)
                    ->get();
            } else {
                // Limited receipt data (no clinic info)
                $data = DB::table('clinic_receipts as cr')
                    ->join('plans as p', 'cr.plan_id', '=', 'p.id')
                    ->join('users as u', 'cr.user_id', '=', 'u.id')
                    ->select(
                        'cr.id as receipt_id',
                        'cr.transaction_id',
                        'cr.transaction_status',
                        'cr.total_amount',
                        'cr.valid_till',
                        'cr.created_at',
                        'p.name as plan_name',
                        'p.price as plan_price',
                        'u.name as user_name'
                    )
                    ->where('cr.id', $receipt->id)
                    ->get();
            }

            return response()->json([
                'success' => true,
                'message' => 'Receipt saved successfully',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error saving receipt: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of receipts for a specific clinic.
     *
     * @param  int  $clinicId
     * @return \Illuminate\Http\Response
     */
    public function getClinicReceipts($clinicId)
    {
        try {
            $receipts = DB::table('clinic_receipts as cr')
                ->join('clinic_info as ci', 'cr.clinic_id', '=', 'ci.clinic_id')
                ->join('plans as p', 'cr.plan_id', '=', 'p.id')
                ->join('users as u', 'cr.user_id', '=', 'u.id')
                ->select(
                    'cr.id as receipt_id',
                    'cr.transaction_id',
                    'cr.transaction_status',
                    'cr.total_amount',
                    'cr.valid_till',
                    'cr.created_at',
                    'ci.clinic_name',
                    'p.name as plan_name',
                    'u.name as user_name'
                )
                ->where('cr.clinic_id', $clinicId)
                ->orderBy('cr.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $receipts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching receipts: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get details for clinic registration form.
     *
     * @return \Illuminate\Http\Response
     */
    public function getDetailsForClinic()
    {
        try {
            $plans = Plan::select('id', 'name', 'description', 'price')->get();
            $users = User::where('type', 1)->select('id', 'name')->get(); // Assuming type 1 is for partners

            return response()->json([
                'plans' => $plans,
                'users' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching details: ' . $e->getMessage()
            ], 500);
        }
    }
}