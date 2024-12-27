<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inquiry;

class InquiryController extends Controller
{
    /**
     * Fetch all contact inquiries from the database.
     */
    public function inquiry()
    {
        // Fetch all records from the contact_us table
        $inquiries = Inquiry::all();
        
        // Return the data as a JSON response
        return response()->json($inquiries);
    }
}

