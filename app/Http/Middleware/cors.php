<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // List of allowed origins
        $allowedOrigins = [
            'https://example.com',
            'https://anotherdomain.com',
        ];

        // Get the origin of the request
        $origin = $request->header('Origin');

        // Determine if the request's origin is in the list of allowed origins
        if (in_array($origin, $allowedOrigins)) {
            return $next($request)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        // Return the response without CORS headers if the origin is not allowed
        return $next($request);
    }
}
