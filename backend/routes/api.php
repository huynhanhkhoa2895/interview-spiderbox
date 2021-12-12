<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(["namespace"=>"App\Http\Controllers\Api",],function(){
    Route::group(["prefix"=>"verify"],function(){
        Route::post('login', 'Verify@login');
        Route::post('register', 'Verify@register');
    });
    Route::group(['middleware' => ['jwt.auth','checkUser']],function(){
        Route::post('shortUrl', 'Home@shortUrl');
        Route::get('getUrl', 'Home@getUrl');
        foreach(["Url"] as $module){
            Route::group(["prefix" => strtolower($module)],function() use ($module){
                Route::get('/',"$module@actionList");
                Route::get('/list',"$module@actionList");
                Route::get('/view/{id}',"$module@actionView");
                Route::get('/add',"$module@actionAdd");
                Route::get('/edit/{id}',"$module@actionAdd");
                Route::post('/add',"$module@postAdd")->name("api".strtolower($module)."add");
                Route::delete('/deletes',"$module@actionDelete");
            });
        }
    });
    
    
});
