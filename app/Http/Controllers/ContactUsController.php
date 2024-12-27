<?php

namespace App\Http\Controllers;

use App\Models\ContactUs;
use Illuminate\Http\Request;

class ContactUsController extends Controller
{


    public function viewcontact()
    {
        // Fetch all records from the contact_us table
        $contactUsData = ContactUs::all();

        // Return the data as a JSON response
        return response()->json($contactUsData);
    }
    
    /**
     * Store the form input in the database.
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'mobile' => 'required|string|max:20',
            'location' => 'required|string|max:255',
            'vehicle_category' => 'required|string',
            'vehicle_registration_number' => 'required|string|max:255',
        ]);

        // Create a new ContactUs instance and save the validated data
        ContactUs::create([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'mobile' => $request->input('mobile'),
            'location' => $request->input('location'),
            'vehicle_category' => $request->input('vehicle_category'),
            'vehicle_registration_number' => $request->input('vehicle_registration_number'),
        ]);

        // Return a success response
        return response()->json(['message' => 'Contact information saved successfully'], 200);
    }
}
