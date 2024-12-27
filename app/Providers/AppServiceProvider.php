<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use App\Http\Middleware\Authorization;
use Illuminate\Http\Middleware\HandleCors;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(Router $router)
    {
        $this->app['router']->pushMiddlewareToGroup('api', HandleCors::class);
        
        $router->aliasMiddleware('role', Authorization::class);

    }
}
