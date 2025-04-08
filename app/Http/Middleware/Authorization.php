<?php namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;   
use Illuminate\Http\Request;                                                    

class Authorization
{
    public function handle($request, Closure $next, $role)
    {
        $user = Auth::user();
        
        if ($role === 'admin' && $user && $user->type === 0) {
            return $next($request);
        } elseif ($role === 'user' && $user && $user->type === 1) {
            return $next($request);
        }
        elseif ($role === 'compounder' && $user && $user->type === 2) {
            return $next($request);
        }

        return response()->json(['error' => 'Unauthorized.'], 401);
    }
}
