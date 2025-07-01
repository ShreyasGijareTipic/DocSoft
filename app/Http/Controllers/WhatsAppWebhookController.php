<?php

namespace App\Http\Controllers;

use App\Models\Online_Appointments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Models\Clinic;

class WhatsAppWebhookController extends Controller
{
    private $verifyToken = "my_secure_webhook_token_123";
  

    // public function verifyToken(Request $request)
    // {
    //     $mode = $request->query('hub_mode');
    //     $verifyToken = $request->query('hub_verify_token');
    //     $challenge = $request->query('hub_challenge');

    //     if ($mode === 'subscribe' && $verifyToken === $this->verifyToken) {
    //         return response($challenge, 200)->header('Content-Type', 'text/plain');
    //     }

    //     return response('Forbidden', 403);
    // }
     public function verifyToken(Request $request)
    {
        $mode = $request->query('hub_mode');
        $verifyToken = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        // ✅ Check if any clinic has this verify token
        $clinic = Clinic::where('clinic_webhook_tokan', $verifyToken)->first();

        if ($mode === 'subscribe' && $clinic) {
            Log::info("✅ Webhook verified for clinic ID: {$clinic->id}");
            return response($challenge, 200)->header('Content-Type', 'text/plain');
        }

        Log::warning("❌ Invalid webhook verification attempt with token: $verifyToken");
        return response('Forbidden', 403);
    }

    public function webhook(Request $request)
    {
        if ($request->isMethod('get')) return $this->verifyToken($request);
        if ($request->isMethod('post')) return $this->receiveMessage($request);
        return response('Method not allowed', 405);
    }

    // private function receiveMessage(Request $request)
    // {
    //     try {
    //         Log::info('📩 Received payload: ' . json_encode($request->all()));

    //         $entry = $request->input('entry', []);
    //         $changes = $entry[0]['changes'][0]['value'] ?? null;

    //         if (!$changes || empty($changes['messages'])) {
    //             return response()->json(['message' => 'No message found'], 200);
    //         }

    //         $messageData = $changes['messages'][0];
    //         $phoneNumber = $messageData['from'] ?? null;
    //         $profileName = $changes['contacts'][0]['profile']['name'] ?? 'Guest';

    //         $buttonPayload = $messageData['interactive']['button_reply']['id'] ?? null;
    //         $listReplyId = $messageData['interactive']['list_reply']['id'] ?? null;

    //         $text = $messageData['text']['body'] ?? null;

    //         if (!$phoneNumber) return response()->json(['message' => 'No phone number'], 200);


    //         // FLOW: Check which step the user is in
    //         $step = Cache::get("step_{$phoneNumber}", 'ask_date');

    //         // ✅ Cleaned date selection block
    //         // if ($step === 'ask_date' && $listReplyId) {
    //         //     Cache::put("date_{$phoneNumber}", $listReplyId, now()->addMinutes(10));
    //         //     Cache::put("step_{$phoneNumber}", 'ask_time', now()->addMinutes(10));
    //         //     $this->sendTimeOfDayButtons($phoneNumber);
    //         //     return response()->json(['status' => 'date selected'], 200);
    //         // }

    //         $isDateFormat = preg_match('/^\d{4}-\d{2}-\d{2}$/', $listReplyId);
    //         if ($buttonPayload === 'menu' || $listReplyId === 'menu') {
    //             // Reset flow
    //             Cache::put("step_{$phoneNumber}", 'ask_date', now()->addMinutes(10));
    //             Cache::forget("date_{$phoneNumber}");
    //             Cache::forget("time_{$phoneNumber}");

    //             $this->appointmentMessage($phoneNumber, "🔁 You’ve returned to the main menu.");
    //             $this->sendDateList($phoneNumber);
    //             return response()->json(['status' => 'Menu triggered'], 200);
    //         }

    //         //cancel appointment by customer through whatsapp
    //         if ($buttonPayload === 'cancelAppointment' || $listReplyId === 'cancelAppointment') {
    //             $this->cancelAppointmentByPhone($phoneNumber);
    //             return response()->json(['status' => 'cancelled via WhatsApp'], 200);
    //         }

    //         if ($listReplyId && $isDateFormat && in_array($step, ['ask_date', 'ask_time', 'ask_slot'])) {
    //             // Check if listReplyId is a valid date
    //             Cache::put("date_{$phoneNumber}", $listReplyId, now()->addMinutes(10));
    //             Cache::put("step_{$phoneNumber}", 'ask_time', now()->addMinutes(10));

    //             $this->appointmentMessage($phoneNumber, "📅 Date updated. Please choose a time of day:");
    //             Log::alert($phoneNumber);
    //             $this->sendTimeOfDayButtons($phoneNumber);

    //             return response()->json(['status' => 'date updated'], 200);
    //         }
    //         if (in_array($listReplyId, ['morning', 'afternoon', 'night', 'menu'])) {
    //             // Save time of day
    //             Cache::put("time_{$phoneNumber}", $listReplyId, now()->addMinutes(10));
    //             Cache::put("step_{$phoneNumber}", 'ask_slot', now()->addMinutes(10));

    //             // Send available time slots for the selected time of day
    //             $this->sendListMessage($phoneNumber, $listReplyId);

    //             return response()->json(['status' => 'Time of day selected and slots sent'], 200);
    //         }
    //         if ($listReplyId) {
    //             if ($step === 'ask_slot') {
    //                 $slotTime = $this->formatSlotId($listReplyId);
    //                 $selectedDate = Cache::get("date_{$phoneNumber}", Carbon::now()->toDateString());
    //                 $timeOfDay = Cache::get("time_{$phoneNumber}", 'unknown');

    //                 $alreadyBooked = Online_Appointments::where('date', $selectedDate)
    //                     ->where('time', $slotTime)
    //                     ->exists();

    //                 if ($alreadyBooked) {
    //                     $this->appointmentMessage($phoneNumber, "❌ Sorry, this slot is already booked. Please choose another.");

    //                     // Rewind step to ask_slot
    //                     Cache::put("step_{$phoneNumber}", 'ask_time', now()->addMinutes(10));
    //                     $this->sendTimeOfDayButtons($phoneNumber);
    //                 } else {    
    //                     try {
    //                         // Online_Appointments::create([
    //                         //     'name' => $profileName,
    //                         //     'phone' => $phoneNumber,
    //                         //     'date' => $selectedDate,
    //                         //     'time' => $slotTime,
    //                         //     'status' => '0',
    //                         //     'service' => 'service 1',
    //                         //     'tokan' => '1'
    //                         // ]);
    //                         // Use the selected appointment date instead of today
    //     $appointmentDate = Carbon::parse($selectedDate)->format('Y-m-d');

    //     // Get the latest token number for that selected date
    //     $latestToken = Online_Appointments::where('date', $appointmentDate)
    //         ->max(DB::raw('CAST(tokan AS UNSIGNED)'));

    //     $nextToken = $latestToken ? $latestToken + 1 : 1;

    //     // Create the appointment
    //     Online_Appointments::create([
    //         'name' => $profileName,
    //         'phone' => $phoneNumber,
    //         'date' => $appointmentDate,
    //         'time' => $slotTime,
    //         'status' => '0',
    //         'service' => 'service 1',
    //         'tokan' => $nextToken
    //     ]);


    //                     } catch (\Illuminate\Database\QueryException $e) {
    //                         // If duplicate, send reschedule flow
    //                         $this->appointmentMessage($phoneNumber, "❌ Sorry, this slot is already booked. Please choose another.");
    //                     }
    //                     $this->sendConfirmationMessage($phoneNumber, $selectedDate, $slotTime);
    //                     Cache::forget("step_{$phoneNumber}");
    //                 }
    //             }
    //         } elseif ($buttonPayload) {
    //             if ($step === 'ask_date') {
    //                 $date = $buttonPayload === 'today' ? Carbon::now()->toDateString() : Carbon::now()->addDay()->toDateString();
    //                 Cache::put("date_{$phoneNumber}", $date, now()->addMinutes(10));
    //                 Cache::put("step_{$phoneNumber}", 'ask_time', now()->addMinutes(10));

    //                 $this->sendTimeOfDayButtons($phoneNumber);
    //                 // } elseif ($step === 'ask_time') {
    //                 //     Cache::put("time_{$phoneNumber}", $buttonPayload, now()->addMinutes(10));
    //                 //         Cache::put("step_{$phoneNumber}", 'ask_slot', now()->addMinutes(10));

    //                 //     $this->sendListMessage($phoneNumber, $buttonPayload);
    //                 // }
    //             }
    //         } elseif ($text) {
    //             // Start flow
    //             Cache::put("step_{$phoneNumber}", 'ask_date', now()->addMinutes(10));
    //             $this->sendDateList($phoneNumber);
    //         }

    //         return response()->json(['status' => 'Message processed'], 200);
    //     } catch (\Exception $e) {
    //         Log::error("❌ Error in receiveMessage: " . $e->getMessage());
    //         return response()->json(['error' => $e->getMessage()], 500);
    //     }
    // }
 private function receiveMessage(Request $request)
{
    try {
        Log::info('📩 Received payload: ' . json_encode($request->all()));

        $entry = $request->input('entry', []);
        $changes = $entry[0]['changes'][0]['value'] ?? null;

        if (!$changes || empty($changes['messages'])) {
            return response()->json(['message' => 'No message found'], 200);
        }

        $messageData = $changes['messages'][0];
        $phoneNumber = $messageData['from'] ?? null;
        $profileName = $changes['contacts'][0]['profile']['name'] ?? 'Guest';
        $phoneNumberId = $changes['metadata']['phone_number_id'] ?? null; // ✅ NEW

        $buttonPayload = $messageData['interactive']['button_reply']['id'] ?? null;
        $listReplyId = $messageData['interactive']['list_reply']['id'] ?? null;
        $text = $messageData['text']['body'] ?? null;

        if (!$phoneNumber || !$phoneNumberId) {
            return response()->json(['message' => 'Missing phone number or phone ID'], 200);
        }

        $step = Cache::get("step_{$phoneNumber}", 'ask_date');

        if ($buttonPayload === 'menu' || $listReplyId === 'menu') {
            Cache::put("step_{$phoneNumber}", 'ask_date', now()->addMinutes(10));
            Cache::forget("date_{$phoneNumber}");
            Cache::forget("time_{$phoneNumber}");

            $this->appointmentMessage($phoneNumber, $phoneNumberId,"🔁 You’ve returned to the main menu.");
            $this->sendDateList($phoneNumber, $phoneNumberId); // ✅ UPDATED
            return response()->json(['status' => 'Menu triggered'], 200);
        }

        if ($buttonPayload === 'cancelAppointment' || $listReplyId === 'cancelAppointment') {
            $this->cancelAppointmentByPhone($phoneNumber,$phoneNumberId );
            return response()->json(['status' => 'cancelled via WhatsApp'], 200);
        }

        $isDateFormat = preg_match('/^\d{4}-\d{2}-\d{2}$/', $listReplyId);
        if ($listReplyId && $isDateFormat && in_array($step, ['ask_date', 'ask_time', 'ask_slot'])) {
            Cache::put("date_{$phoneNumber}", $listReplyId, now()->addMinutes(10));
            Cache::put("step_{$phoneNumber}", 'ask_time', now()->addMinutes(10));

            $this->appointmentMessage($phoneNumber,$phoneNumberId, "📅 Date updated. Please choose a time of day:");
            Log::alert($phoneNumber);
            $this->sendTimeOfDayButtons($phoneNumber,$phoneNumberId);

            return response()->json(['status' => 'date updated'], 200);
        }

        if (in_array($listReplyId, ['morning', 'afternoon', 'night', 'menu'])) {
            Cache::put("time_{$phoneNumber}", $listReplyId, now()->addMinutes(10));
            Cache::put("step_{$phoneNumber}", 'ask_slot', now()->addMinutes(10));

            $this->sendListMessage($phoneNumber, $listReplyId, $phoneNumberId);
            return response()->json(['status' => 'Time of day selected and slots sent'], 200);
        }

        if ($listReplyId) {
            if ($step === 'ask_slot') {
                $slotTime = $this->formatSlotId($listReplyId);
                $selectedDate = Cache::get("date_{$phoneNumber}", Carbon::now()->toDateString());
                $timeOfDay = Cache::get("time_{$phoneNumber}", 'unknown');

                $alreadyBooked = Online_Appointments::where('date', $selectedDate)
                    ->where('time', $slotTime)
                    ->exists();

                if ($alreadyBooked) {
                    $this->appointmentMessage($phoneNumber,$phoneNumberId, "❌ Sorry, this slot is already booked. Please choose another.");
                    Cache::put("step_{$phoneNumber}", 'ask_time', now()->addMinutes(10));
                    $this->sendTimeOfDayButtons($phoneNumber, $phoneNumberId);
                } else {
                    try {
                        $appointmentDate = Carbon::parse($selectedDate)->format('Y-m-d');
                        $latestToken = Online_Appointments::where('date', $appointmentDate)
                            ->max(DB::raw('CAST(tokan AS UNSIGNED)'));

                        $nextToken = $latestToken ? $latestToken + 1 : 1;

                        Online_Appointments::create([
                            'name' => $profileName,
                            'phone' => $phoneNumber,
                            'date' => $appointmentDate,
                            'time' => $slotTime,
                            'status' => '0',
                            'service' => 'service 1',
                            'tokan' => $nextToken,
                            // 'clinic_id' => 0,

                        ]);
                    } catch (\Illuminate\Database\QueryException $e) {
                        $this->appointmentMessage($phoneNumber,$phoneNumberId, "❌ Sorry, this slot is already booked. Please choose another.");
                    }

                    $this->sendConfirmationMessage($phoneNumber, $selectedDate, $slotTime,$phoneNumberId);
                    Cache::forget("step_{$phoneNumber}");
                }
            }
        } elseif ($buttonPayload) {
            if ($step === 'ask_date') {
                $date = $buttonPayload === 'today' ? Carbon::now()->toDateString() : Carbon::now()->addDay()->toDateString();
                Cache::put("date_{$phoneNumber}", $date, now()->addMinutes(10));
                Cache::put("step_{$phoneNumber}", 'ask_time', now()->addMinutes(10));

                $this->sendTimeOfDayButtons($phoneNumbe, $phoneNumberId);
            }
        } elseif ($text) {
            Cache::put("step_{$phoneNumber}", 'ask_date', now()->addMinutes(10));
            $this->sendDateList($phoneNumber, $phoneNumberId); // ✅ UPDATED
        }

        return response()->json(['status' => 'Message processed'], 200);
    } catch (\Exception $e) {
        Log::error("❌ Error in receiveMessage: " . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}




    protected function sendDateButtons($to)
    {
        $this->sendButtons($to, "📅 Please select a date for your appointment:", $phoneNumberId,[
            ['id' => 'today', 'title' => 'Today'],
            ['id' => 'tomorrow', 'title' => 'Tomorrow']
        ]);
    }

    // protected function sendDateList($to)
    // {
    //     $date = \Carbon\Carbon::now();
    //     $dates = [];

    //     // Generate next 5 working days (excluding Sundays)

    //     while (count($dates) < 5) {
    //         if (!$date->isSunday()) {
    //             $label = $date->isToday() ? 'Today' : ($date->isTomorrow() ? 'Tomorrow' : $date->format('l, d M Y'));
    //             $dates[] = [
    //                 'id' => $date->toDateString(),
    //                 'title' => $label,
    //                 'description' => 'Choose this date'
    //             ];
    //         }
    //         $date->addDay();
    //     }

    //     // Add "Main Menu" option at the end
    //     // if (count($dates) < 10) {
    //     //     $dates[] = [
    //     //         'id' => 'menu',
    //     //         'title' => '🔁 Go to Main Menu',
    //     //         'description' => 'Restart appointment booking flow'
    //     //     ];
    //     // }
    //     if (count($dates) < 10) {
    //         $dates[] = [
    //             'id' => 'cancelAppointment',
    //             'title' => '❌ cancel appointment',
    //             'description' => 'Cacle your Booked appointment'
    //         ];
    //     }

    //     $payload = [
    //         'messaging_product' => 'whatsapp',
    //         'to' => $to,
    //         'type' => 'interactive',
    //         'interactive' => [
    //             'type' => 'list',
    //             'body' => [
    //                 'text' => '📆 Please select your appointment date:'
    //             ],
    //             'action' => [
    //                 'button' => 'Select Date',
    //                 'sections' => [[
    //                     'title' => 'Available Dates',
    //                     'rows' => $dates
    //                 ]]
    //             ]
    //         ]
    //     ];

    //     // Send message
    //     $response = Http::withToken(env('WHATSAPP_API_TOKEN'))
    //         ->withOptions(['verify' => false])
    //         ->post('https://graph.facebook.com/v18.0/' . env('WHATSAPP_PHONE_ID') . '/messages', $payload);

    //     Log::info('📨 Date list sent: ' . $response->body());
   
    // }
protected function sendDateList($to, $phoneNumberId)
{
    $date = \Carbon\Carbon::now();
    $dates = [];

    while (count($dates) < 5) {
        if (!$date->isSunday()) {
            $label = $date->isToday()
                ? 'Today'
                : ($date->isTomorrow()
                    ? 'Tomorrow'
                    : $date->format('l, d M Y'));

            $dates[] = [
                'id' => $date->toDateString(),
                'title' => $label,
                'description' => 'Choose this date'
            ];
        }
        $date->addDay();
    }

    $dates[] = [
        'id' => 'cancelAppointment',
        'title' => '❌ Cancel Appointment',
        'description' => 'Cancel your booked appointment'
    ];

    $payload = [
        'messaging_product' => 'whatsapp',
        'to' => $to,
        'type' => 'interactive',
        'interactive' => [
            'type' => 'list',
            'body' => [
                'text' => '📆 Please select your appointment date:'
            ],
            'action' => [
                'button' => 'Select Date',
                'sections' => [[
                    'title' => 'Available Dates',
                    'rows' => $dates
                ]]
            ]
        ]
    ];

    // ✅ Get clinic using phone number ID
    $clinic = Clinic::where('clinic_whatsapp_url', $phoneNumberId)->first();

    if (!$clinic || !$clinic->clinic_permanant_tokan || !$clinic->clinic_whatsapp_url) {
        Log::error('❌ Clinic not found or missing WhatsApp credentials for phone ID: ' . $phoneNumberId);
        return;
    }

    $response = Http::withToken($clinic->clinic_permanant_tokan)
        ->withOptions(['verify' => false])
        ->post('https://graph.facebook.com/v18.0/' . $clinic->clinic_whatsapp_url . '/messages', $payload);

    Log::info("📨 Date list sent to $to | Clinic ID: {$clinic->id}");
    Log::info("🧾 Response: " . $response->body());
}



    protected function sendTimeOfDayButtons($to, $phoneNumberId)  // $phoneNumberId
    {
        $selectedDate = Cache::get("date_{$to}");
        $now = \Carbon\Carbon::now(); // current server time
        $today = $now->toDateString();
        $timeOfDay = [];

        if ($selectedDate === $today) {
            $currentHour = $now->hour;
            // Define conditions dynamically
            if ($currentHour < 12) {
                $timeOfDay[] = ['id' => 'morning', 'title' => '🌅 Morning'];
                $timeOfDay[] = ['id' => 'afternoon', 'title' => '🌞 Afternoon'];
                $timeOfDay[] = ['id' => 'night', 'title' => '🌙 Night'];
            } elseif ($currentHour >= 12 && $currentHour < 17) {
                $timeOfDay[] = ['id' => 'afternoon', 'title' => '🌞 Afternoon'];
                $timeOfDay[] = ['id' => 'night', 'title' => '🌙 Night'];
            } else {
                $timeOfDay[] = ['id' => 'night', 'title' => '🌙 Night'];
            }
        } else {
            $timeOfDay[] = ['id' => 'morning', 'title' => '🌅 Morning'];
            $timeOfDay[] = ['id' => 'afternoon', 'title' => '🌞 Afternoon'];
            $timeOfDay[] = ['id' => 'night', 'title' => '🌙 Night'];
        }

        // Add main menu option
        $timeOfDay[] = ['id' => 'menu', 'title' => '🔁 Main Menu'];

        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'interactive',
            'interactive' => [
                'type' => 'list',
                'body' => [
                    'text' => '🕓 Please select time of day for your appointment:'
                ],
                'action' => [
                    'button' => 'Select Time',
                    'sections' => [[
                        'title' => 'Available Time Slots',
                        'rows' => $timeOfDay
                    ]]
                ]
            ]
        ];

        // $response = Http::withToken(env('WHATSAPP_API_TOKEN'))
        //     ->withOptions(['verify' => false])
        //     ->post('https://graph.facebook.com/v18.0/' . env('WHATSAPP_PHONE_ID') . '/messages', $payload);

        // Log::info('📨 Time of Day: ' . $response->body());
            $clinic = Clinic::where('clinic_whatsapp_url', $phoneNumberId)->first();

    if (!$clinic || !$clinic->clinic_permanant_tokan || !$clinic->clinic_whatsapp_url) {
        Log::error('❌ Clinic not found or missing WhatsApp credentials for phone ID: ' . $phoneNumberId);
        return;
    }

    $response = Http::withToken($clinic->clinic_permanant_tokan)
        ->withOptions(['verify' => false])
        ->post('https://graph.facebook.com/v18.0/' . $clinic->clinic_whatsapp_url . '/messages', $payload);

    Log::info("📨 Date list sent to $to | Clinic ID: {$clinic->id}");
    Log::info("🧾 Response: " . $response->body());
    }


//     protected function appointmentMessage($to, $phoneNumberId, $text)
//     {
//         // Http::withToken(env('WHATSAPP_API_TOKEN'))
//         //     ->withOptions(['verify' => false])
//         //     ->post('https://graph.facebook.com/v18.0/' . env('WHATSAPP_PHONE_ID') . '/messages', [
//         //         'messaging_product' => 'whatsapp',
//         //         'to' => $to,
//         //         'type' => 'text',
//         //         'text' => ['body' => $text]
//         //     ]);
//         // Step 1: Find the clinic by WhatsApp Phone ID
// $clinic = Clinic::where('clinic_whatsapp_url', $phoneNumberId)->first();

// if (!$clinic || !$clinic->clinic_permanant_tokan || !$clinic->clinic_whatsapp_url) {
//     Log::error('❌ Clinic not found or missing WhatsApp credentials for phone ID: ' . $phoneNumberId);
//     return;
// }

// // Step 2: Build the payload
// $payload = [
//     'messaging_product' => 'whatsapp',
//     'to' => $to,
//     'type' => 'text',
//     'text' => ['body' => $text]
// ];

// // Step 3: Send the message using clinic-specific credentials
// $response = Http::withToken($clinic->clinic_permanant_tokan)
//     ->withOptions(['verify' => false])
//     ->post('https://graph.facebook.com/v18.0/' . $clinic->clinic_whatsapp_url . '/messages', $payload);

// // Step 4: Logging
// Log::info("📨 WhatsApp message sent to $to | Clinic ID: {$clinic->id}");
// Log::info("🧾 Response: " . $response->body());

//     }
protected function appointmentMessage($to, $phoneNumberId, $text)
{
    $clinic = Clinic::where('clinic_whatsapp_url', $phoneNumberId)->first();

    if (!$clinic || !$clinic->clinic_permanant_tokan || !$clinic->clinic_whatsapp_url) {
        Log::error('❌ Clinic not found or missing WhatsApp credentials for phone ID: ' . $phoneNumberId);
        return;
    }

    $payload = [
        'messaging_product' => 'whatsapp',
        'to' => $to,
        'type' => 'text',
        'text' => ['body' => $text]
    ];

    $response = Http::withToken($clinic->clinic_permanant_tokan)
        ->withOptions(['verify' => false])
        ->post('https://graph.facebook.com/v18.0/' . $clinic->clinic_whatsapp_url . '/messages', $payload);

    Log::info("📨 WhatsApp message sent to $to | Clinic ID: {$clinic->id}");
    Log::info("🧾 Response: " . $response->body());
}


    protected function sendButtons($to, $text, $buttons,$phoneNumberId)
    {
        $buttonArray = array_map(fn($btn) => [
            'type' => 'reply',
            'reply' => $btn
        ], $buttons);

        // $response = Http::withToken(env('WHATSAPP_API_TOKEN'))
        //     ->withOptions(['verify' => false])
        //     ->post('https://graph.facebook.com/v18.0/' . env('WHATSAPP_PHONE_ID') . '/messages', [
        //         'messaging_product' => 'whatsapp',
        //         'to' => $to,
        //         'type' => 'interactive',
        //         'interactive' => [
        //             'type' => 'button',
        //             'body' => ['text' => $text],
        //             'action' => ['buttons' => $buttonArray]
        //         ]
        //     ]);

        // Log::info("✅ Button Sent: " . $response->body());
           $clinic = Clinic::where('clinic_whatsapp_url', $phoneNumberId)->first();

    if (!$clinic || !$clinic->clinic_permanant_tokan || !$clinic->clinic_whatsapp_url) {
        Log::error('❌ Clinic not found or missing WhatsApp credentials for phone ID: ' . $phoneNumberId);
        return;
    }

    $payload = [
        'messaging_product' => 'whatsapp',
        'to' => $to,
        'type' => 'interactive',
        'interactive' => [
            'type' => 'button',
            'body' => ['text' => $text],
            'action' => ['buttons' => $buttonArray]
        ]
    ];

    $response = Http::withToken($clinic->clinic_permanant_tokan)
        ->withOptions(['verify' => false])
        ->post('https://graph.facebook.com/v18.0/' . $clinic->clinic_whatsapp_url . '/messages', $payload);

    Log::info("📨 Button message sent to $to | Clinic ID: {$clinic->id}");
    Log::info("🧾 Response: " . $response->body());
    }

    protected function sendListMessage($to, $timeOfDay,$phoneNumberId )
    {
        $selectedDate = Cache::get("date_{$to}", Carbon::now()->toDateString());
        $now = Carbon::now();
        $today = $now->toDateString();

        $slotOptions = [
            'morning' => ['title' => '🌅 Morning Slots', 'slots' => ['9:00 AM', '9:30 AM', '10:00 AM', 'Menu']],
            'afternoon' => ['title' => '🌞 Afternoon Slots', 'slots' => ['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','Menu']],
            'night' => ['title' => '🌙 Night Slots', 'slots' => ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM','8:00 PM', 'Menu']],
            
        ];

        if (!isset($slotOptions[$timeOfDay])) return;

        $allSlots = $slotOptions[$timeOfDay]['slots'];

        // ❌ Get all booked slots for that date
        $bookedSlots = Online_Appointments::where('date', $selectedDate)->pluck('time')->toArray();

        // ✅ Filter available slots based on:
        // - not booked
        // - not passed (only if date is today and not "Menu")
        $availableSlots = array_filter($allSlots, function ($slot) use ($bookedSlots, $selectedDate, $today, $now) {
            if ($slot === 'Menu') return true;

            if (in_array($slot, $bookedSlots)) return false; //remove booked slots

            // If selected date is today, exclude past time slots
            if ($selectedDate === $today) {
                try {
                    $slotTime = Carbon::createFromFormat('Y-m-d g:i A', $selectedDate . ' ' . trim($slot));
                    return $slotTime->greaterThanOrEqualTo($now);
                } catch (Exception $e) {
                    Log::error("Time parsing failed for slot [$slot]: " . $e->getMessage());
                    return false;
                }
            }

            return true;
        });;

        // If all slots are booked, inform user
        if (empty($availableSlots)) {
            $this->appointmentMessage($to, $phoneNumberId, "❌ Sorry, all *{$timeOfDay}* slots are booked. Please choose another time of day.");
            Cache::put("step_{$to}", 'ask_time', now()->addMinutes(10));
            $this->sendTimeOfDayButtons($to);
            return;
        }

        $rows = array_map(function ($slot) {
            return [
                'id' => strtolower(str_replace([' ', ':'], '_', $slot)),
                'title' => $slot,
                'description' => 'Book this slot' 
            ];
        }, $availableSlots);

        // $response = Http::withToken(env('WHATSAPP_API_TOKEN'))
        //     ->withOptions(['verify' => false])
        //     ->post('https://graph.facebook.com/v18.0/' . env('WHATSAPP_PHONE_ID') . '/messages', [
        //         'messaging_product' => 'whatsapp',
        //         'to' => $to,
        //         'type' => 'interactive',
        //         'interactive' => [
        //             'type' => 'list',
        //             'body' => ['text' => "🕒 Please select a time slot:"],
        //             'action' => [
        //                 'button' => 'Select Slot',
        //                 'sections' => [[
        //                     'title' => $slotOptions[$timeOfDay]['title'],
        //                     'rows' => $rows
        //                 ]]
        //             ]
        //         ]
        //     ]);
        // Step 1: Get the clinic based on phone number ID
$clinic = Clinic::where('clinic_whatsapp_url', $phoneNumberId)->first();

if (!$clinic || !$clinic->clinic_permanant_tokan || !$clinic->clinic_whatsapp_url) {
    Log::error('❌ Clinic not found or missing WhatsApp credentials for phone ID: ' . $phoneNumberId);
    return;
}

// Step 2: Build payload for list message
$payload = [
    'messaging_product' => 'whatsapp',
    'to' => $to,
    'type' => 'interactive',
    'interactive' => [
        'type' => 'list',
        'body' => ['text' => "🕒 Please select a time slot:"],
        'action' => [
            'button' => 'Select Slot',
            'sections' => [[
                'title' => $slotOptions[$timeOfDay]['title'],
                'rows' => $rows
            ]]
        ]
    ]
];

// Step 3: Send message to WhatsApp API using clinic credentials
$response = Http::withToken($clinic->clinic_permanant_tokan)
    ->withOptions(['verify' => false])
    ->post('https://graph.facebook.com/v18.0/' . $clinic->clinic_whatsapp_url . '/messages', $payload);

// Step 4: Log info
Log::info("📨 Time slot list sent to $to | Clinic ID: {$clinic->id}");
Log::info("🧾 Response: " . $response->body());

        Log::info("✅ Slot List Sent: " . $response->body());
    }

    protected function sendConfirmationMessage($to, $date, $slotTime, $phoneNumberId)
    {
        $formattedDate = Carbon::parse($date)->format('d M Y');

        // $response = Http::withToken(env('WHATSAPP_API_TOKEN'))
        //     ->withOptions(['verify' => false])
        //     ->post('https://graph.facebook.com/v18.0/' . env('WHATSAPP_PHONE_ID') . '/messages', [
        //         'messaging_product' => 'whatsapp',
        //         'to' => $to,
        //         'type' => 'text',
        //         'text' => [
        //             'body' => "✅ Your appointment is confirmed for *$formattedDate* at *$slotTime*. Thank you!"
        //         ]
        //     ]);
        // Step 1: Get the clinic from the database using phone number ID
$clinic = Clinic::where('clinic_whatsapp_url', $phoneNumberId)->first();

if (!$clinic || !$clinic->clinic_permanant_tokan || !$clinic->clinic_whatsapp_url) {
    Log::error('❌ Clinic not found or missing WhatsApp credentials for phone ID: ' . $phoneNumberId);
    return;
}

// Step 2: Build the payload for the message
$payload = [
    'messaging_product' => 'whatsapp',
    'to' => $to,
    'type' => 'text',
    'text' => [
        'body' => "✅ Your appointment is confirmed for *$formattedDate* at *$slotTime*. Thank you!"
    ]
];

// Step 3: Send message to the WhatsApp API
$response = Http::withToken($clinic->clinic_permanant_tokan)
    ->withOptions(['verify' => false])
    ->post('https://graph.facebook.com/v18.0/' . $clinic->clinic_whatsapp_url . '/messages', $payload);

// Step 4: Log the result
Log::info("📨 Confirmation sent to $to | Clinic ID: {$clinic->id}");
Log::info("🧾 Response: " . $response->body());


        Log::info("✅ Confirmation Sent: " . $response->body());
    }

    // private function formatSlotId($slotId)
    // {
    //     $slot = str_replace('_', ':', $slotId);
    //     $slot = str_replace('::', ':', $slot);
    //     return strtoupper(str_replace([':AM', ':PM'], [' AM', ' PM'], $slot));
    // }

    //Cancle Appointment for frontend using api
    public function cancelAppointment(Request $request)
    {
        $phoneNumber = $request->input('phone');
        Log::info("Request cancel phone: " . $phoneNumber);
        // $phoneNumberId = $request->input('clinic_whatsapp_url'); 

        if (!$phoneNumber) {
            return response()->json(['message' => 'Phone number missing'], 400);
        }

        try {
            $appointment = Online_Appointments::where('phone', $phoneNumber)
                ->where('status', '0')
                ->latest()
                ->first();

            if (!$appointment) {
                Log::info("Appointment not found for phone: $phoneNumber");
                $this->appointmentMessage($phoneNumber, $phoneNumberId, "⚠️ No active appointment found to cancel.");
                return response()->json(['message' => 'No active appointment found'], 404);
            }

            $appointment->status = '1';
            $appointment->save();

            $date = Carbon::parse($appointment->date)->format('d M Y');
            $time = $appointment->time;

            $this->appointmentMessage($phoneNumber, $phoneNumberId, "❌ Your appointment on *$date* at *$time* has been cancelled successfully.");

            $appointment->time = '0:00';
            $appointment->save();

            // Optional: clear cache for this user
            Cache::forget("step_{$phoneNumber}");
            Cache::forget("date_{$phoneNumber}");
            Cache::forget("time_{$phoneNumber}");

            return response()->json(['message' => 'Appointment cancelled'], 200);
        } catch (\Exception $e) {
            Log::error("❌ Error in cancelAppointment: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    //Method to cancel appointment using webhook, i.e. customer cancel appointment from whatsapp
    // private function cancelAppointmentByPhone($phoneNumber,$phoneNumberId )
    // {
    //     Log::info("Request cancel phone (via webhook): " . $phoneNumber);
        
    //     if (!$phoneNumber) {
    //         return false;
    //     }

    //     $appointment = Online_Appointments::where('phone', $phoneNumber)
    //         ->where('status', '0')
    //         ->latest()
    //         ->first();

    //     if (!$appointment) {
    //         Log::info("Appointment not found for phone: $phoneNumber");
    //         $this->appointmentMessage($phoneNumber, $phoneNumberId, "⚠️ No active appointment found to cancel.");
    //         return false;
    //     }

    //     // Combine appointment date and time into Carbon
    //     try {
    //         $appointmentDateTime = \Carbon\Carbon::parse("{$appointment->date} {$appointment->time}");
    //     } catch (\Exception $e) {
    //         Log::error("Invalid appointment datetime for cancellation: " . $e->getMessage());
    //         $this->appointmentMessage($phoneNumber, $phoneNumberId, "⚠️ Could not process cancellation due to time format.");
    //         return false;
    //     }

    //     $now = now();
    //     $diffInMinutes = $now->diffInMinutes($appointmentDateTime, false); // false to allow negative

    //     // Check if within 2 hours
    //     if ($diffInMinutes < 120) {
    //         $this->appointmentMessage($phoneNumber, $phoneNumberId,"⏳ Sorry, appointments can only be cancelled at least *2 hours before* the scheduled time.");
    //         Log::info("Cancellation blocked for $phoneNumber – only {$diffInMinutes} minutes left.");
    //         return false;
    //     }

    //     $date = \Carbon\Carbon::parse($appointment->date)->format('d M Y');
    //     $time = $appointment->time;

    //     $this->appointmentMessage($phoneNumber,$phoneNumberId, "❌ Your appointment on *$date* at *$time* has been cancelled successfully.");

    //     $appointment->status = '1';
    //     $appointment->time = '0:00';
    //     $appointment->save();

    //     // clear cache
    //     Cache::forget("step_{$phoneNumber}");
    //     Cache::forget("date_{$phoneNumber}");
    //     Cache::forget("time_{$phoneNumber}");

    //     return true;
    // }
private function cancelAppointmentByPhone($phoneNumber, $phoneNumberId)
{
    Log::info("📩 Cancel request via webhook for: $phoneNumber (Phone ID: $phoneNumberId)");

    if (!$phoneNumber || !$phoneNumberId) {
        Log::warning("❗ Missing phone number or phone ID.");
        return false;
    }

    $appointment = Online_Appointments::where('phone', $phoneNumber)
        ->where('status', '0')
        ->latest()
        ->first();

    if (!$appointment) {
        Log::info("❗ No active appointment found for: $phoneNumber");
        $this->appointmentMessage( $phoneNumber,$phoneNumberId, "⚠️ No active appointment found to cancel.");
        return false;
    }

    try {
        $appointmentDateTime = Carbon::parse("{$appointment->date} {$appointment->time}");
    } catch (\Exception $e) {
        Log::error("❌ Error parsing appointment datetime: " . $e->getMessage());
        $this->appointmentMessage( $phoneNumber, $phoneNumberId,"⚠️ Could not process cancellation due to time format.");
        return false;
    }

    $now = now();
    $diffInMinutes = $now->diffInMinutes($appointmentDateTime, false);

    if ($diffInMinutes < 120) {
        $this->appointmentMessage( $phoneNumber, $phoneNumberId,"⏳ Sorry, appointments can only be cancelled at least *2 hours before* the scheduled time.");
        Log::info("⛔ Cancellation blocked – only $diffInMinutes minutes left.");
        return false;
    }

    $date = Carbon::parse($appointment->date)->format('d M Y');
    $time = $appointment->time;

    $this->appointmentMessage( $phoneNumber, $phoneNumberId, "❌ Your appointment on *$date* at *$time* has been cancelled successfully.");

    $appointment->status = '1';
    $appointment->time = '0:00';
    $appointment->save();

    Cache::forget("step_{$phoneNumber}");
    Cache::forget("date_{$phoneNumber}");
    Cache::forget("time_{$phoneNumber}");

    Log::info("✅ Appointment cancelled successfully for $phoneNumber");

    return true;
}



    private function formatSlotId($slotId)
    {
        return Carbon::createFromFormat('g_i_a', $slotId)->format('g:i A'); // if $slotId = 9_00_am
    }
}



// try {
//     $appointmentDate = Carbon::parse($selectedDate)->format('Y-m-d');

//     // ✅ Fetch the clinic using phone ID
//     $clinic = Clinic::where('clinic_phone_id', $phoneNumberId)->first();

//     if (!$clinic) {
//         Log::error("❌ Clinic not found for phoneNumberId: $phoneNumberId");
//         $this->appointmentMessage($phoneNumber, $phoneNumberId, "❌ Internal error. Clinic not identified.");
//         return;
//     }

//     // ✅ Generate next token for this clinic and date
//     $latestToken = Online_Appointments::where('date', $appointmentDate)
//         ->where('clinic_id', $clinic->id) // filter by clinic
//         ->max(DB::raw('CAST(tokan AS UNSIGNED)'));

//     $nextToken = $latestToken ? $latestToken + 1 : 1;

//     // ✅ Create appointment with clinic_id
//     Online_Appointments::create([
//         'name' => $profileName,
//         'phone' => $phoneNumber,
//         'date' => $appointmentDate,
//         'time' => $slotTime,
//         'status' => '0',
//         'service' => 'service 1',
//         'tokan' => $nextToken,
//         'clinic_id' => $clinic->id  // ✅ Store clinic_id
//     ]);

// } catch (\Illuminate\Database\QueryException $e) {
//     Log::error("❌ Appointment creation error: " . $e->getMessage());
//     $this->appointmentMessage($phoneNumber, $phoneNumberId, "❌ Sorry, this slot is already booked. Please choose another.");
// }
