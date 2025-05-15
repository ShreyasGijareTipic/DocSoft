<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DoctorMedicalObservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;;
use App\Models\Clinic;


class AuthController extends Controller
{
    // function registers(Request $request){
    //     $fields = $request->validate([
    //         'name' => 'required|string',
    //         'email' => 'nullable|string|unique:users,email',
    //         'mobile' => 'required|string',
    //         'registration_number' => 'required|string|max:255|unique:doctors',
    //         'speciality' => 'required|string|max:255',
    //         'education' => 'required|string|max:255',
    //         'type' => 'required|integer',
    //         'password' => 'required|string',
    //         'blocked'=>'required|integer'
    //     ]);

    //     $user = User::create([
    //         'name'=> $fields['name'],
    //         'email'=> $fields['email'],
    //         'mobile'=> $fields['mobile'],
    //         'registration_number' => $fields['registration_number'],
    //         'speciality' => $fields['speciality'],
    //         'education' => $fields['education'],
    //         'type'=> $fields['type'],
    //         'password'=> bcrypt($fields['password']),
    //         'blocked'=> $fields['blocked']

    //     ]);

    //     $token = $user->createToken('webapp')->plainTextToken;
    //     $response = [
    //         'user'=> $user,
    //         'token'=> $token
    //     ];
    //     \Log::info('Registration successful', $response);

    //     return response($response,201);




        
    // }

    /**
     * Register a new doctor or receptionist
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function registers(Request $request)
    {
        try {
            // Validate user data
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'mobile' => 'required|string|size:10|unique:users',
                'registration_number' => 'required|string',
                'speciality' => 'required|string',
                'education' => 'required|string',
                'consulting_fee' => 'required|numeric',
                'address' => 'required|string',
                'clinic_id' => 'required|exists:clinic,id',
                'type' => 'required|in:1,2',
                // We don't validate medical_observations here as they'll be handled separately
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Create the user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'mobile' => $request->mobile,
                'registration_number' => $request->registration_number,
                'speciality' => $request->speciality,
                'education' => $request->education,
                'consulting_fee' => $request->consulting_fee,
                'address' => $request->address,
                'clinic_id' => $request->clinic_id,
                'type' => $request->type,
            ]);

            // Handle medical observations if provided and if this is a doctor (type = 1)
            if ($request->has('medical_observations') && $request->type == 1) {
                DoctorMedicalObservation::create([
                    'doctor_id' => $user->id,
                    'bp' => $request->medical_observations['bp'],
                    'pulse' => $request->medical_observations['pulse'],
                    'weight' => $request->medical_observations['weight'],
                    'height' => $request->medical_observations['height'],
                    'systemic_examination' => $request->medical_observations['systemic_examination'],
                    'diagnosis' => $request->medical_observations['diagnosis'],
                    'past_history' => $request->medical_observations['past_history'],
                    'complaint' => $request->medical_observations['complaint'],
                ]);
            }

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

      

    // public function login(Request $request)
    // {
    //     $fields = $request->validate([
    //         'email' => 'required|string',
    //         'password' => 'required|string'
    //     ]);
    
    //     // Check if email exists
    //     $user = User::where('email', $fields['email'])->first();
    
    //     // Check password
    //     if (!$user || !Hash::check($fields['password'], $user->password)) {
    //         return response()->json([
    //             'message' => 'Invalid credentials'
    //         ], 401);
    //     }
    
    //     // Check if user is blocked
    //     if ($user->blocked == 1) {
    //         return response()->json([
    //             'message' => 'User not allowed. Kindly contact admin.',
    //             'blocked'=> true
    //         ], 201);
    //     }
        

    //     $token = $user->createToken('webapp',[$user])->plainTextToken;
    //     $response = [
    //         'user' => $user,
    //         'token' => $token
    //     ];
    //     return response()->json($response, 201);
    // }






//     public function login(Request $request)
// {
//     // Validate the incoming request data
//     $fields = $request->validate([
//         'email' => 'required|string|email', // Ensure it's a valid email format
//         'password' => 'required|string'
//     ]);

//     // Check if email exists
//     $user = User::where('email', $fields['email'])->first();

//     // Log user existence check
//     \Log::info('User existence check:', ['email' => $fields['email'], 'exists' => $user ? true : false]);

//     // Check password
//     if (!$user || !Hash::check($fields['password'], $user->password)) {
//         \Log::info('Invalid credentials for user:', ['email' => $fields['email']]);
//         return response()->json([
//             'message' => 'Invalid credentials'
//         ], 401); // Unauthorized
//     }

//     // Check if user is blocked
//     if ($user->blocked) { // No need to compare with 1; it's a boolean
//         \Log::info('Blocked user attempted to log in:', ['email' => $fields['email']]);
//         return response()->json([
//             'message' => 'User not allowed. Kindly contact admin.',
//             'blocked' => true
//         ], 403); // Forbidden
//     }

//     // Create a token for the user
//     $token = $user->createToken('webapp')->plainTextToken;

//     // Prepare response
//     $response = [
//         'user' => [
//             'id' => $user->id,
//             'name' => $user->name,
//             'email' => $user->email,
//             'mobile' => $user->mobile,
//             'speciality' => $user->speciality,
//             'education' => $user->education,
//             'registration_number' =>$user->registration_number,
//         ],
//         'token' => $token
//     ];

//     \Log::info('User logged in successfully:', ['email' => $fields['email']]);

//     return response()->json($response, 200); // OK
// }

// ##############################################################################



public function login(Request $request)
{
    \Log::info('Incoming login request:', $request->all());
    // Validate the incoming request data
    $fields = $request->validate([
        'email' => 'required|string|email', // Ensure it's a valid email format
        'password' => 'required|string'
    ]);

    // Check if email exists
    $user = User::where('email', $fields['email'])->first();

    // Log user existence check
    \Log::info('User existence check:', ['email' => $fields['email'], 'exists' => $user ? true : false]);
    

    // Check password
    if (!$user || !Hash::check($fields['password'], $user->password)) {
        \Log::info('Invalid credentials for user:', ['email' => $fields['email']]);
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401); // Unauthorized
    }

    // Check if user is blocked
    if ($user->blocked) { // No need to compare with 1; it's a boolean
        \Log::info('Blocked user attempted to log in:', ['email' => $fields['email']]);
        return response()->json([
            'message' => 'User not allowed. Kindly contact admin.',
            'blocked' => true
        ], 403); // Forbidden
    }

    // Create a token for the user
    $token = $user->createToken('webapp')->plainTextToken;

    // Prepare response
    $response = [
        'doctorId' => $user->id, // Change to return doctorId instead of user
        'user' => [
            'id' => $user->id, 
            'name' => $user->name,
            'email' => $user->email,
            'mobile' => $user->mobile,
            'speciality' => $user->speciality,
            'clinic_id' =>$user->clinic_id,
            'education' => $user->education,
            'type' => $user->type,
            'registration_number' => $user->registration_number,
            'consulting_fee' => $user->consulting_fee
        ],
        'token' => $token
    ];

    \Log::info('User logged in successfully:', ['email' => $fields['email']]);

    return response()->json($response, 200); // OK
}

// ####################################################################
// public function login(Request $request)
// {
//     $credentials = $request->only('email', 'password');

//     if (Auth::attempt($credentials)) {
//         $user = Auth::user();
//         $token = $user->createToken('YourAppName')->accessToken;

//         return response()->json([
//             'token' => $token,
//             'doctorId' => $user->id, // Assuming the user's ID is the doctor ID
//         ]);
//     }

//     return response()->json(['error' => 'Unauthorized'], 401);
// }


// public function login(Request $request)
// {
//     $credentials = $request->only('email', 'password');

//     if (Auth::attempt($credentials)) {
//         $doctor = Auth::user();
//         $token = $doctor->createToken('YourAppName')->accessToken;

//         return response()->json([
//             'token' => $token,
//             'doctor_id' => $doctor->id,
//             'name' => $doctor->name,
//             'registration_number' => $doctor->registration_number,
//         ]);
//     }

//     return response()->json(['error' => 'Unauthorized'], 401);
// }







    function mobileLogin(Request $request){
        $fields = $request->validate([
            'mobile' => 'required|string',
            'password' => 'required|string'
        ]);

        //Check if mobile no exists
        $user = User::where('mobile',$fields['mobile'])->first();

        //Check password
        if(!$user || !Hash::check($fields['password'], $user->password)){
            return response->json([
                'message'=>'Please provide valid credentials'
            ],401);
        }

        if($user->blocked == 1){
            return response([
                'message'=>'Kindly contact admin'
            ],401);
        }

        $token = $user->createToken('mobileLoginToken')->plainTextToken;
        $response = [
            'user'=> $user,
            'token'=> $token
        ];
        return response($response,201);
    }




    function logout(Request $request){
        auth()->user()->tokens()->delete();
        return ['message'=>'Logged out'];
    }

   



    

    function changePassword(Request $request){
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
            'new_password' => 'required|string',
        ]);

        //Check if email exists
        $user = User::where('email',$fields['email'])->first();

        //Check password
        if(!$user || !Hash::check($fields['password'], $user->password)){
            return response([
                'message'=>'Please provide valid credentials'
            ],401);
        }else{
            $user->password =  bcrypt($fields['new_password']);
            $user->save();
            auth()->user()->tokens()->delete();
        }

        $token = $user->createToken('webapp')->plainTextToken;
        $response = [
            'Message'=> 'Password Changed Successfully,Login with new Password',
            'status'=> 1
            // 'user'=> $user,
            // 'token'=> $token
        ];
        return response($response,200);
    }


    public function allUsers(Request $request)
    {
        if($request->customers == 'true'){
            return User::where('type',10)->paginate(50);
        }
        return User::where('type','<',10)->paginate(50);
    }


    // public function update(Request $request)
    // {
    //     $obj = User::find($request->id);
    //     $obj->update($request->all());
    //     return $obj;
    // }
   

public function update(Request $request)
{
    $request->validate([
        // 'id' => 'required|exists:users,id',
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'mobile' => 'required|string|digits:10',
        'address' => 'nullable|string',
        'registration_number' => 'nullable|string',
        'speciality' => 'nullable|string',
        'education' => 'nullable|string',
    ]);

    $user = User::find($request->id);

    // ✅ Update only allowed fields
    $user->update([
        'name' => $request->name,
        'email' => $request->email,
        'mobile' => $request->mobile,
        'address' => $request->address,
        'registration_number' => $request->registration_number,
        'speciality' => $request->speciality,
        'education' => $request->education,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'User updated successfully.',
        'user' => $user
    ]);
}

    

    function registerUser(Request $request){
        $fields = $request->validate([
            'name' => 'required|string',
            'mobile' => 'required|string|unique:users,mobile',
            'type' => 'required',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'name'=> $fields['name'],
            'email'=> $fields['email'],
            'mobile'=> $fields['mobile'],
            'type'=> $fields['type'],
            'password'=> bcrypt($fields['password'])
        ]);
        return response($user,201);
    }



     // Doctor Registration
    //  namespace App\Http\Controllers;

    //  use App\Models\Doctor;
    //  use Illuminate\Http\Request;
    //  use Illuminate\Support\Facades\Hash;
    //  use Illuminate\Support\Facades\Validator;
    //  use Illuminate\Support\Facades\Log; // Add this line
     
    // //  class AuthController extends Controller
    // //  {
    //      public function register(Request $request)
    //      {
    //          $validator = Validator::make($request->all(), [
    //              'doctor_name' => 'required|string',
    //              'registration_number' => 'required|string|unique:doctors',
    //              'speciality' => 'required|string',
    //              'education' => 'required|string',
    //              'contact' => 'required|string',
    //              'email' => 'required|string|email|unique:doctors',
    //              'password' => 'required|string|confirmed|min:6',
    //          ]);
     
    //          if ($validator->fails()) {
    //              return response()->json($validator->errors(), 400);
    //          }
     
    //          try {
    //              $doctor = Doctor::create([
    //                  'doctor_name' => $request->doctor_name,
    //                  'registration_number' => $request->registration_number,
    //                  'speciality' => $request->speciality,
    //                  'education' => $request->education,
    //                  'contact' => $request->contact,
    //                  'email' => $request->email,
    //                  'password' => Hash::make($request->password), // Hashing the password
    //              ]);
     
    //              return response()->json(['message' => 'Doctor registered successfully', 'doctor' => $doctor], 201);
    //          } catch (\Exception $e) {
    //              Log::error('Registration error: ' . $e->getMessage());
    //              return response()->json(['error' => 'An error occurred while registering the doctor.'], 500);
    //          }
    //      }
    // //  }
     







    // // Doctor Login
    // public function login(Request $request)
    // {
    //     $credentials = $request->validate([
    //         'email' => 'required|string|email',
    //         'password' => 'required|string',
    //     ]);
    
    //     // Check if user exists
    //     $user = User::where('email', $credentials['email'])->first();
    //     if (!$user) {
    //         return response()->json(['message' => 'User not found'], 404);
    //     }
    
    //     // Check credentials
    //     if (!Auth::attempt($credentials)) {
    //         return response()->json(['message' => 'Invalid credentials'], 401);
    //     }
    
    //     // Get authenticated user
    //     $doctor = Auth::user();
    
    //     // Create a token for the user
    //     $token = $doctor->createToken('doctor_token')->plainTextToken;
    
    //     return response()->json([
    //         'message' => 'Login successful',
    //         'doctor' => $doctor,
    //         'token' => $token,
    //     ], 200);
    // }



    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }



    public function showdoctordatabyclinicid($clinicid)
{
    // Fetch the users whose 'clinic' field matches the provided clinicid
    $users = User::where('clinic_id', $clinicid)->get(); // This fetches all users with the specified clinic ID

    // Check if any users were found
    if ($users->isEmpty()) {
        return response()->json(['error' => 'No users found for this clinic'], 404);
    }

    // Return the users data
    return response()->json($users);
}

    




}

