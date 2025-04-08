<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\Authorization;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    // ->withMiddleware(function (Middleware $middleware) {
    //     //
    // })

    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => Authorization::class, // ✅ Corrected: Passed an array
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
   


// use Illuminate\Foundation\Application;
// use Illuminate\Foundation\Configuration\Exceptions;
// use Illuminate\Foundation\Configuration\Middleware;
// use App\Http\Middleware\Authorization;

// return Application::configure(basePath: dirname(__DIR__))
//     ->withRouting(   
//         web: __DIR__.'/../routes/web.php',
//         api: __DIR__.'/../routes/api.php',
//         commands: __DIR__.'/../routes/console.php',
//         health: '/up',
//     )
//     ->withMiddleware(function (Middleware $middleware) {
//         $middleware->alias('role', Authorization::class); // ✅ Correct syntax
//     })
//     ->withExceptions(function (Exceptions $exceptions) {
//         //
//     })->create();

