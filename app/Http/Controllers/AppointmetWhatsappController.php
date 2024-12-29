<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;

use Illuminate\Http\Request;

class AppointmetWhatsappController extends Controller
{
    
    private function appointmentMessage($phoneNumber, $message)
    {
        $client = new Client();
        $response = $client->post('https://graph.facebook.com/v21.0/482346864961658/messages', [
            'headers' => [
                'Authorization' => 'Bearer EAAXDOdIVS2ABO0pcYo6OZCMESZCtXJZCnnj7zIcBQTJNCwjT5i1JBtmH0WxcEbLmLnElrepsRGZBT9thPqkLF4SYWk0I4I9GupWz30ZBSYoxNZCAYNWxByBZCv2f4JNgE5cUZBl9dAgoRlJuMtE4bZABGn6cPZAiUG2vMVOap1myLd24sZBhro9CwDeoZBZBGgSIasvpr5QZDZD', // Replace with your actual access token
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'messaging_product' => 'whatsapp',
                'to' => $phoneNumber,
                'type' => 'text',
                'text' => [
                    'body' => $message,
                ]
            ]
        ]);

        return json_decode($response->getBody(), true);
    }




   public function rescheduleAppointment(Request $request)
{
    $patientPhoneNumber = $request->phone_number; // Patient's phone number
    
    // Validate phone number
    $request->validate([
        'phone_number' => 'required|string|min:10|max:15',
    ]);
    
    // Available slots for today, tomorrow, and day after tomorrow
    $today = now()->format('Y-m-d'); // Today's date
    $tomorrow = now()->addDay()->format('Y-m-d'); // Tomorrow's date
    $dayAfterTomorrow = now()->addDays(2)->format('Y-m-d'); // Day after tomorrow's date
    
    // Available slots for each day
    $slots = [
        "$today" => ["Morning", "Afternoon", "Evening"],
        "$tomorrow" => ["Morning", "Afternoon", "Evening"],
        "$dayAfterTomorrow" => ["Morning", "Afternoon", "Evening"],
    ];

    // Format options for WhatsApp interactive message
    $sections = [];
    
    // Add predefined date slots (Today, Tomorrow, Day After Tomorrow)
    foreach ($slots as $date => $times) {
        $items = [];
        foreach ($times as $time) {
            $items[] = [
                'id' => str_replace([' ', ':'], ['_', ''], "$date-$time"), // Replace invalid characters
                'title' => $time, // Display time only (within 24 characters)
                'description' => "Date: $date", // Optional description
            ];
        }
        $sections[] = [
            'title' => "Slots for $date", // Section title
            'rows' => $items,
        ];
    }

    // Add the custom date selection option
    $sections[] = [
        'title' => "Custom Date", // Title for custom date option
        'rows' => [
            [
                'id' => 'custom_date',
                'title' => 'Select a Custom Date', // Option for custom date selection
                'description' => 'Choose a date of your choice (Format: YYYY-MM-DD)',
            ]
        ]
    ];

    // Construct the interactive message
    $client = new Client();
    $response = $client->post('https://graph.facebook.com/v21.0/482346864961658/messages', [
        'headers' => [
            'Authorization' => 'Bearer EAAXDOdIVS2ABO0pcYo6OZCMESZCtXJZCnnj7zIcBQTJNCwjT5i1JBtmH0WxcEbLmLnElrepsRGZBT9thPqkLF4SYWk0I4I9GupWz30ZBSYoxNZCAYNWxByBZCv2f4JNgE5cUZBl9dAgoRlJuMtE4bZABGn6cPZAiUG2vMVOap1myLd24sZBhro9CwDeoZBZBGgSIasvpr5QZDZD', // Replace with your access token
            'Content-Type' => 'application/json',
        ],
        'json' => [
            'messaging_product' => 'whatsapp',
            'to' => $patientPhoneNumber,
            'type' => 'interactive',
            'interactive' => [
                'type' => 'list',
                'header' => [
                    'type' => 'text',
                    'text' => 'Available Appointment Slots',
                ],
                'body' => [
                    'text' => 'Please select a slot below or choose a custom date:',
                ],
                'footer' => [
                    'text' => 'Tap a slot to confirm.',
                ],
                'action' => [
                    'button' => 'View Slots',
                    'sections' => $sections,
                ],
            ],
        ]
    ]);

    return response()->json(json_decode($response->getBody(), true));
}

    

    // Function to handle accept appointment
    public function acceptAppointment(Request $request)
    {
        $patientPhoneNumber = $request->phone_number; // Patient's phone number
        $appointmentDate = $request->appointment_date; // Appointment date

        $message = "Your appointment on $appointmentDate has been confirmed. We look forward to seeing you!";

        $response = $this->appointmentMessage($patientPhoneNumber, $message);

        return response()->json($response);
    }


// ----------------------------------------------------------------------------------------------------------------------------------     

//     public function acceptAppointment(Request $request)
//     {
//         $patientPhoneNumber = $request->phone_number; // Patient's phone number
//         $appointment_date = $request->appointment_date; // Appointment date
//         $patient_name = $request->patient_name; // Patient's name
//         $appointment_time = $request->appointment_time;
//         $doctor_name = $request->doctor_name;


//         // Define the template name and parameters
//         $templateName = 'accepted_ap';
//         $templateParams = [
//             ['type' => 'text', 'text' => strval($patient_name)],        // {{1}}
//             ['type' => 'text', 'text' => strval($doctor_name)],         // {{2}}
//             ['type' => 'text', 'text' => strval($appointment_date)],    // {{3}}
//             ['type' => 'text', 'text' => strval($appointment_time)]     // {{4}}
//         ];
//         // $templateParams = [$appointment_date];
        
// //         \Log::info('Phone Number: ' . $patientPhoneNumber);
// // \Log::info('Template Name: ' . $templateName);
// // \Log::info('Template Params:', $templateParams);

// //         dd($templateParams);
//         $response = $this->sendMessage($patientPhoneNumber, $templateName, $templateParams);

//         return response()->json($response);
//     }



    // private function sendMessage($phoneNumber, $templateName, $templateParams)
    // {
    //     $client = new Client();
    //     $response = $client->post('https://graph.facebook.com/v21.0/482346864961658/messages', [
    //         'headers' => [
    //             'Authorization' => 'Bearer EAAXDOdIVS2ABO0pcYo6OZCMESZCtXJZCnnj7zIcBQTJNCwjT5i1JBtmH0WxcEbLmLnElrepsRGZBT9thPqkLF4SYWk0I4I9GupWz30ZBSYoxNZCAYNWxByBZCv2f4JNgE5cUZBl9dAgoRlJuMtE4bZABGn6cPZAiUG2vMVOap1myLd24sZBhro9CwDeoZBZBGgSIasvpr5QZDZD',
    //             'Content-Type' => 'application/json',
    //         ],
    //         'json' => [
    //             'messaging_product' => 'whatsapp',
    //             'to' => $phoneNumber,
    //             'type' => 'template',
    //             'template' => [
    //                 'name' => $templateName,
    //                 'language' => [
    //                     'code' => 'en', // Language code for the template
    //                 ],
    //                 'components' => [
    //                     [
    //                         'type' => 'body',
    //                         'parameters' => $templateParams,
    //                     ],
    //                 ],
    //             ]
    //         ] 
    //     ]);

    //     return response()->json(json_decode($response->getBody(), true));
    // }



    // private function sendMessage($phoneNumber, $templateName, $templateParams)
    // {
    //     $client = new Client();
    //     try {
    //         $response = $client->post('https://graph.facebook.com/v21.0/482346864961658/messages', [
    //             'headers' => [
    //                 'Authorization' => 'Bearer EAAXDOdIVS2ABO0pcYo6OZCMESZCtXJZCnnj7zIcBQTJNCwjT5i1JBtmH0WxcEbLmLnElrepsRGZBT9thPqkLF4SYWk0I4I9GupWz30ZBSYoxNZCAYNWxByBZCv2f4JNgE5cUZBl9dAgoRlJuMtE4bZABGn6cPZAiUG2vMVOap1myLd24sZBhro9CwDeoZBZBGgSIasvpr5QZDZD',
    //                 'Content-Type' => 'application/json',
    //             ],
    //             'json' => [
    //                 'messaging_product' => 'whatsapp',
    //                 'to' => $phoneNumber, // Make sure the number is in international format
    //                 'type' => 'template',
    //                 'template' => [
    //                     'name' => $templateName, // Ensure the template name is correct
    //                     'language' => [
    //                         'code' => 'en',
    //                     ],
    //                     'components' => [
    //                         [
    //                             'type' => 'body',
    //                             'parameters' => [
    //                                 ['type' => 'text', 'text' => $templateParams['patient_name']], // Match placeholder for patient name
    //                                 ['type' => 'text', 'text' => $templateParams['doctor_name']], // Match placeholder for doctor name
    //                                 ['type' => 'text', 'text' => $templateParams['appointment_date']], // Match placeholder for appointment date
    //                                 ['type' => 'text', 'text' => $templateParams['appointment_time']], // Match placeholder for appointment time
    //                             ],
    //                         ],
    //                     ],
    //                 ]
    //             ]
    //         ]);
    
    //         $body = json_decode($response->getBody(), true);
    //         return response()->json($body);
    
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => $e->getMessage()]);
    //     }
    // }

//  --------------------------------------------------------------------------------------------------------------------------------- 


// ---------- ### ---------------------------- ### ------------------------------- ###



// ---------- ### ---------------------------- ### ------------------------------- ###





private $verifyToken = "my_secure_webhook_token_123";

public function verifyToken(Request $request)
{
    $mode = $request->query('hub_mode');
    $verifyToken = $request->query('hub_verify_token');
    $challenge = $request->query('hub_challenge');

    if ($mode === 'subscribe' && $verifyToken === $this->verifyToken) {
        return response($challenge, 200)->header('Content-Type', 'text/plain');
    }

    return response('Forbidden: Invalid verify token', 403);
}

public function webhook(Request $request)
{
    if ($request->isMethod('get')) {
        $hubChallenge = $request->input('hub.challenge');
        $hubVerifyToken = $request->input('hub.verify_token');

        if ($hubVerifyToken === $this->verifyToken) {
            return response($hubChallenge, 200);
        }

        return response('Forbidden', 403);
    }

    return $this->receiveMessage($request);
}




private function receiveMessage(Request $request)
{
try {
    \Log::info('Received payload: ' . json_encode($request->all())); // Log the entire payload

    $entry = $request->input('entry', []);
    if (empty($entry)) {
        return response()->json(['error' => 'Invalid payload'], 400);
    }

    $messageData = $entry[0]['changes'][0]['value']['messages'][0] ?? null;
    if (!$messageData) {
        return response()->json(['error' => 'No message found'], 400);
    }

    $phoneNumber = $messageData['from'] ?? null;
    if (!$phoneNumber) {
        return response()->json(['error' => 'Phone number is required'], 400);
    }

 
    $language = session('marathi', 'english');

    $buttonReplyId = $messageData['interactive']['button_reply']['id'] ?? null;
    if ($buttonReplyId) {
        \Log::info("Button clicked: " . $buttonReplyId); // Log the clicked button reply ID
        
        // Update language preference based on button
        if ($buttonReplyId === 'language_english') {
            session(['language' => 'english']);
            $language = 'english';
        } else if ($buttonReplyId === 'language_marathi') {
            session(['language' => 'marathi']);
            $language = 'marathi';
        }

        switch ($buttonReplyId) {
            case 'language_english':
                return $this->xyz($phoneNumber, 'english');
            case 'language_marathi':
                return $this->xyz($phoneNumber, 'marathi');
            case 'donation_e_100':
                return $this->sendDonationResponse($phoneNumber,'english', 100);
            case 'donation_e_500':
                return $this->sendDonationResponse($phoneNumber,'english', 500);
            case 'donation_e_1000':
                return $this->sendDonationResponse($phoneNumber, 'english', 1000);
                case 'donation_m_100':
                    return $this->sendDonationResponse($phoneNumber,'marathi', 100);
                case 'donation_m_500':
                    return $this->sendDonationResponse($phoneNumber,'marathi', 500);
                case 'donation_m_1000':
                    return $this->sendDonationResponse($phoneNumber,'marathi', 1000);
            default:
                return $this->sendMessage($phoneNumber, $language === 'marathi'
                    ? 'अवैध बटण पर्याय' : 'Invalid button option');
        }
    }

    // Handle incoming messages (if any)
    $incomingMessage = $messageData['text']['body'] ?? null;
    if ($incomingMessage) {
        return $this->sendLanguageButtons($phoneNumber, $language); // Use language preference
    }

    return response()->json(['error' => 'No valid message or interaction'], 400);
} catch (\Exception $e) {
    \Log::error("Error in receiveMessage function: " . $e->getMessage());
    return response()->json(['error' => $e->getMessage()], 500);
}
}



private function sendDonationResponse($phoneNumber, $language, $amount)
{
$donationLink = "https://nlpratishthan.tipic.co.in/#/donate-form";

// Construct message based on the amount and language
if ($language === 'marathi') {
    // Marathi language response
    $messageText = "आपल्या पाठिंब्याबद्दल धन्यवाद! कृपया ₹{$amount} येथे दान करा: {$donationLink}";
    
} else if($language ==='english') {
    // English language response
    $messageText = "Thank you for your support! Please donate ₹{$amount} here: {$donationLink}";
  
}

return $this->sendMessage($phoneNumber, $messageText);
}







private function sendLanguageButtons($phoneNumber)
{
    try {
        $client = new Client();
        $response = $client->post('https://graph.facebook.com/v21.0/482346864961658/messages', [
            'headers' => [
                'Authorization' => 'Bearer EAAXDOdIVS2ABO0pcYo6OZCMESZCtXJZCnnj7zIcBQTJNCwjT5i1JBtmH0WxcEbLmLnElrepsRGZBT9thPqkLF4SYWk0I4I9GupWz30ZBSYoxNZCAYNWxByBZCv2f4JNgE5cUZBl9dAgoRlJuMtE4bZABGn6cPZAiUG2vMVOap1myLd24sZBhro9CwDeoZBZBGgSIasvpr5QZDZD',
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'messaging_product' => 'whatsapp',
                'to' => $phoneNumber,
                'type' => 'interactive',
                'interactive' => [
                    'type' => 'button',
                    'body' => [
                        'text' => 'Hello, Welcome To *Nilesh Lanke Pratishthan!* Choose Your Language'
                    ],
                    'action' => [
                        'buttons' => [
                            [
                                'type' => 'reply',
                                'reply' => [
                                    'id' => 'language_english',
                                    'title' => 'English'
                                ]
                            ],
                            [
                                'type' => 'reply',
                                'reply' => [
                                    'id' => 'language_marathi',
                                    'title' => 'मराठी'
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]);

        return response()->json(json_decode($response->getBody(), true));
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
} 

private function xyz($phoneNumber, $language)
{
try {
    // Set the message text based on the selected language
    $messageText = $language === 'marathi'
        ? 'तुम्ही एका नोबेल कारणासाठी आम्हाला पाठिंबा देऊ इच्छिता? कृपया दान करा: https://mlanileshlanke.in/'
        : 'Would you like to support us in a noble cause? Please donate: https://mlanileshlanke.in/';

    // Set the buttons for donation options
  if($language==='marathi'){
    $buttons = [
        [
            'type' => 'reply',
            'reply' => [
                'id' => 'donation_m_100',
                'title' => $language === 'marathi' ? '१०० रूपये' : '₹100'
            ]
        ],
        [
            'type' => 'reply',
            'reply' => [
                'id' => 'donation_m_500',
                'title' => $language === 'marathi' ? '५०० रूपये' : '₹500'
            ]
        ],
        [
            'type' => 'reply',
            'reply' => [
                'id' => 'donation_m_1000',
                'title' => $language === 'marathi' ? '१००० रूपये' : '₹1000'
            ]
        ]
    ];

  }
  else{

    $buttons = [
        [
            'type' => 'reply',
            'reply' => [
                'id' => 'donation_e_100',
                'title' => '₹100'
            ]
        ],
        [
            'type' => 'reply',
            'reply' => [
                'id' => 'donation_e_500',
                'title' => '₹500'
            ]
        ],
        [
            'type' => 'reply',
            'reply' => [
                'id' => 'donation_e_1000',
                'title' => '₹1000'
            ]
        ]
    ];

  }
   


  

    // Send the message using the WhatsApp API
    $client = new Client();
    $response = $client->post('https://graph.facebook.com/v21.0/482346864961658/messages', [
        'headers' => [
            'Authorization' => 'Bearer EAAXDOdIVS2ABO0pcYo6OZCMESZCtXJZCnnj7zIcBQTJNCwjT5i1JBtmH0WxcEbLmLnElrepsRGZBT9thPqkLF4SYWk0I4I9GupWz30ZBSYoxNZCAYNWxByBZCv2f4JNgE5cUZBl9dAgoRlJuMtE4bZABGn6cPZAiUG2vMVOap1myLd24sZBhro9CwDeoZBZBGgSIasvpr5QZDZD', // Replace with actual token
            'Content-Type' => 'application/json',
        ],
        'json' => [
            'messaging_product' => 'whatsapp',
            'to' => $phoneNumber,
            'type' => 'interactive',
            'interactive' => [
                'type' => 'button',
                'body' => [
                    'text' => $messageText
                ],
                'action' => [
                    'buttons' => $buttons
                ]
            ]
        ]
    ]);

    return response()->json(json_decode($response->getBody(), true));
} catch (\Exception $e) {
    \Log::error("Error in xyz function: " . $e->getMessage());
    return response()->json(['error' => $e->getMessage()], 500);
}
}


private function sendMessage($phoneNumber, $message)
{
    try {
        $client = new Client();
        $response = $client->post('https://graph.facebook.com/v21.0/482346864961658/messages', [
            'headers' => [
                'Authorization' => 'Bearer EAAXDOdIVS2ABO0pcYo6OZCMESZCtXJZCnnj7zIcBQTJNCwjT5i1JBtmH0WxcEbLmLnElrepsRGZBT9thPqkLF4SYWk0I4I9GupWz30ZBSYoxNZCAYNWxByBZCv2f4JNgE5cUZBl9dAgoRlJuMtE4bZABGn6cPZAiUG2vMVOap1myLd24sZBhro9CwDeoZBZBGgSIasvpr5QZDZD',
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'messaging_product' => 'whatsapp',
                'to' => $phoneNumber,
                'type' => 'text',
                'text' => [
                    'body' => $message,
                ]
            ]
        ]);

        return response()->json(json_decode($response->getBody(), true));
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}




    


}

