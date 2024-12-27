<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;

use Illuminate\Http\Request;

class AppointmetWhatsappController extends Controller
{
    
    private $apiUrl = 'https://graph.facebook.com/v21.0/482346864961658/messages';
    private $accessToken = 'EAAXDOdIVS2ABO0pcYo6OZCMESZCtXJZCnnj7zIcBQTJNCwjT5i1JBtmH0WxcEbLmLnElrepsRGZBT9thPqkLF4SYWk0I4I9GupWz30ZBSYoxNZCAYNWxByBZCv2f4JNgE5cUZBl9dAgoRlJuMtE4bZABGn6cPZAiUG2vMVOap1myLd24sZBhro9CwDeoZBZBGgSIasvpr5QZDZD';

    public function webhook(Request $request)
    {
        $challenge = $request->input('hub_challenge');
        $verifyToken = $request->input('my_secure_webhook_token_123');

        if ($verifyToken === 'my_secure_webhook_token_123') {
            return response($challenge);
        }

        $data = $request->all();
        Log::info(json_encode($data));

        if (isset($data['entry'][0]['changes'][0]['value']['messages'][0])) {
            $message = $data['entry'][0]['changes'][0]['value']['messages'][0];
            $phoneNumber = $message['from'];
            $text = $message['text']['body'] ?? '';

            if (strtolower($text) === 'appointment') {
                $this->sendAppointmentLink($phoneNumber);
            }
        }

        return response()->json(['status' => 'success']);
    }

    private function sendAppointmentLink($phoneNumber)
    {
        $appointmentLink = 'https://docassist.tipic.co.in/';

        $data = [
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $phoneNumber,
            'type' => 'text',
            'text' => [
                'body' => "Please click the following link to book your appointment: $appointmentLink"
            ]
        ];

        Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->accessToken,
            'Content-Type' => 'application/json',
        ])->post($this->apiUrl . 'PHONE_NUMBER_ID/messages', $data);
    }

    


}

