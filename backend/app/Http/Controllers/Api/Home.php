<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repository\BaseRespository;

class Home extends Controller
{
    //
    function checkUrl($url) : bool{
        return preg_match('%^(?:(?:https?)://)(?:\S+(?::\S*)?@|\d{1,3}(?:\.\d{1,3}){3}|(?:(?:[a-z\d\x{00a1}-\x{ffff}]+-?)*[a-z\d\x{00a1}-\x{ffff}]+)(?:\.(?:[a-z\d\x{00a1}-\x{ffff}]+-?)*[a-z\d\x{00a1}-\x{ffff}]+)*(?:\.[a-z\x{00a1}-\x{ffff}]{2,6}))(?::\d+)?(?:[^\s]*)?$%iu', $url);
    }
    function hashUrl(String $url) : String {
        $string = md5(rand(10,100).md5(now()).md5($url).rand(10,100));
        $strs = str_split($string);
        $code = '';
        for($i = 0;$i < 6;$i++){
            $j = rand(0,count($strs)-1);
            $code .= $strs[$j];
        }
        return $code;
    }
    function shortUrl(Request $request){
        if(!empty($request->domain)){
            if($this->checkUrl($request->url)){
                $responsitory = new BaseRespository("url");
                $check = false;
                if(empty($request->id) || empty($request->code)){
                    while(!$check){
                        $code = $this->hashUrl($request->url);
                        $data = $responsitory->first(["shorten_url"=>$code]);
                        if(empty($data)){
                            $check = true;
                        }
                    }
                }else{
                    $code = $request->code;
                }
  
                $shortlenUrl = ($request->domain ?? config("app.host_shorten_url"))."/".$code;
                $data = $responsitory->storeData([
                    "name"=> $request->name ?? "",
                    "url" => $request->url,
                    "domain" => $request->domain,
                    "code" => $code,
                    "shorten_url" => $shortlenUrl,
                    "user_id"=>$request->user('api')->id
                ]);
                return response()->json(["err"=>0,"msg"=>"Success","data"=>$data]);
            }else{
                return response()->json(["err"=>1,"msg"=>"String is not URL"]);
            }
        }else{
            return response()->json(["err"=>1,"msg"=>"Not have domain"]);
        }

    }
    function getUrl(Request $request){
        $responsitory = new BaseRespository("url");
        $data = $responsitory->first(["shorten_url"=>$request->shorten_url]);
        if(!empty($request->shorten_url) && !empty($data)){
            $newdata = $responsitory->storeData([
                "id" => $data->id,
                "total_click" => $data->total_click+1,
            ]);
            return response()->json(["err"=>0,"msg"=>"Success","data"=>$data]);
        }else{
            return response()->json(["err"=>1,"msg"=>"URL is not exsist"]);

        }
    }
}
