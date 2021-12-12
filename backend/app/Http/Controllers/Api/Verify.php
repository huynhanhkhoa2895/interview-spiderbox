<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Repository\BaseRespository;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Hash;
class Verify extends Controller
{
    public function __construct()
    {
    }
    function isEmail($email) : bool {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return true;
        } else {
            return false;
        }
   }
    //
    function login(Request $request){
        if ($this->isEmail($request->username)) {
            $credentials = ['email'=>$request->username, 'password'=>$request->password,'active' => 1];
        }else{
            $credentials = ['phone'=>$request->username, 'password'=>$request->password,'active' => 1];
        }
        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['err' => 1], 200);
        }
        return $this->me($token);
    }
    public function me($token)
    {
        return response()->json(["data"=>["user"=>auth()->user(),"token"=>$token],'err' => 0]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
    public function register(Request $request)
    {
        $userResponsitory = new BaseRespository("user");
        $data = $userResponsitory->checkUserExist($request->email,$request->phone);
        if(empty($request->email) || empty($request->password)){
            return response()->json(["status" => 0,"msg"=>"Email or Password is required"]);
        }
        if(empty($data)){
            $data = $userResponsitory->storeData([
                "email" => $request->email,
                "name" => $request->name,
                "phone" => $request->phone,
                "password" => Hash::make($request->password),
            ]);
            return response()->json(["status" => 1,"msg"=>"Success","data"=>$data]);
        }
        return response()->json(["status" => 0,"msg"=>"Email or Phone have existed"]);
    }
}
