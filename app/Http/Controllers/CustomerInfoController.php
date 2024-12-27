<?php

namespace App\Http\Controllers;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerInfoController extends Controller
{
    /**
     * Display a listing of the customer info.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Fetch all records from the customer_info table
        $customerInfos = CustomerInfo::all();

        // Return the records as a JSON response
        return response()->json($customerInfos);
    }

    /**
     * Display the specified customer info.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function fileUpload(Request $request){
        $request->validate([
            'customer_name' => 'required|mimes:jpg,jpeg,png|max:2048',
            'dest' => 'required'
        ]);
        // Check if record exists
        if (!$customerInfo) {
            return response()->json(['message' => 'Customer info not found'], 404);
        }

        // Return the record as a JSON response
        return response()->json($customerInfo);
    }




    function registerCustomer(Request $request){
        $fields = $request->validate([
            'customer_name' => 'required|string',
            'address' => 'required|string',
            'contact_person' => 'required|string',
            'email' => 'required|string',
            'mobile' => 'required|string',
        ]);

       
        $block = "0";
        $show = true;
        $customer = Customer::create([
            'customer_name'=> $fields['customer_name'],
            'address'=> $fields['address'],
            'contact_person'=> $fields['contact_person'],
            'email'=> $fields['email'],
            'mobile'=> $fields['mobile'],
            'block'=>$block,
            'show'=> $show
        ]);

        $response = [
            'message'=> "New Customer Added Successfully",
            'new Customer'=> $customer
        ];
        return response($response,201);
    }

    function getCustomerByName(Request $request) {
        // Validate the search input
        $fields = $request->validate([
            'search' => 'required|string',
        ]);
    
        // Use the validated 'search' field to find customers by customer_name
        $customers = Customer::where('customer_name', 'LIKE', '%' . $fields['search'] . '%')->get();
    
        // Check if any customers were found
        if ($customers->isEmpty()) {
            return response()->json(['message' => 'No customer found'], 404);
        }
    
        // Return the matching customers
        return response()->json($customers);
    }
    
    function getCustomer(){
        // $fields = $request->validate([
        //     'customer_name' => 'required|string',
        //     'address' => 'required|string',
        //     'contact_person' => 'required|string',
        //     'email' => 'required|string',
        //     'mobile' => 'required|string',
        // ]);
        
        
            $customers = Customer::all();
            return response()->json($customers, 200);
        
        

    }

  
    public function deleteCustomer($id, Request $request)
{
    $fields = $request->validate([
        'customer_name' => 'required|string',
        'address' => 'required|string',
        'contact_person' => 'required|string',
        'email' => 'required|string',
        'mobile' => 'required|string',
    ]);
    $customer = Customer::find($id);
    $customer = Customer::find($request);
    
    if (!$customer) {
        return response()->json(['message' => 'Customer not found.'], 404);
    }
    
    // Access confirmation from the request
    $confirm = $request->input('confirm');
    
    if ($confirm) {
        // Proceed to delete the customer
        $customer->delete();
        return response()->json(['message' => 'Customer deleted successfully.']);
    } else {
        return response()->json(['message' => 'Deletion not confirmed.'], 400);
    }
}

public function updateCustomer(Request $request, $id)
{
                                                         // Find the customer by ID
    $customer = Customer::find($id);
                                                         // Check if customer exists
    if (!$customer) {
        return response()->json([
            'message' => 'Customer not found'
        ], 404);
    }
                                                         // Validate request(sometimes)
    $fields = $request->validate([
        'customer_name' => 'sometimes|string',
        'address' => 'sometimes|string',
        'contact_person' => 'sometimes|string',
        'email' => 'sometimes|string|email',
        'mobile' => 'sometimes|string',
    ]);
                                                         // Update customer fields if present in the request
    $customer->customer_name = $fields['customer_name'] ?? $customer->customer_name;
    $customer->address = $fields['address'] ?? $customer->address;
    $customer->contact_person = $fields['contact_person'] ?? $customer->contact_person;
    $customer->email = $fields['email'] ?? $customer->email;
    $customer->mobile = $fields['mobile'] ?? $customer->mobile;
                                                         // Save the updated customer
    $customer->save();
                                                         // Return the updated customer data
    return response()->json([
        'message' => 'Customer updated successfully',
        'data' => $customer
    ], 200);
}

    
public function getReportById($id)
{
    try {
        // Fetch the report by ID using findOrFail
        $report = Report::findOrFail($id);

        // Return the found report
        return response()->json($report, 200);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        // Return a 404 response if the report is not found
        return response()->json(['error' => 'Report not found.'], 404);
    } catch (\Exception $e) {
        // Log any other errors for debugging
        \Log::error('Failed to fetch report: ' . $e->getMessage());

        // Return a 500 Internal Server Error response
        return response()->json(['error' => 'Failed to fetch report. Please try again later.'], 500);
    }
}

}
