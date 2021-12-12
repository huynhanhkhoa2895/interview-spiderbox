<?php

namespace App\Http\Controllers\Api;
use App\Repository\BaseRespository;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class Url extends Controller
{
    //
    function __construct(){
        $this->repository = new BaseRespository("url");
    }
    function actionList(Request $request){
        $result = $this->repository->crudList([
            "pagination" => $request->page,
            "limit" => $request->limit ?? 10,
            "order" => ["created_at","desc"],
            "where" => ["user_id"=>$request->user('api')->id]
        ]);
        $arr["table"] = [
            "columns" => [
                ["name"=>"id","label"=>"Id"],
                ["name"=>"name","label"=>"Name"],
                ["name"=>"domain","label"=>"Domain"],
                ["name"=>"url","label"=>"Url","type"=>"url"],
                ["name"=>"shorten_url","label"=>"Shorten Url","type"=>"url"],
                ["name"=>"total_click","label"=>"Total Click"],
                ["name"=>"created_at","label"=>"Created At"],
                ["name"=>"updated_ay","label"=>"Updated At"],
            ],
            "rows" => $result["data"],
            "total" => $result["total"]
        ];
        return response()->json(["err"=>1,"data"=>$arr]);
    }
    function actionView(Request $request){
        $data = $this->repository->first(["id"=>$request->id]);
        return response()->json(["err"=>0,"data"=>$data]);
    }
    function actionAdd(Request $request){
        return response()->json(["err"=>1,"data"=>[]]);
    }
    function actionDelete(Request $request){
        $ids = $request->ids;
        $data = $this->repository->deletes($ids);
        return response()->json(["err"=>0,"data"=>$data]);
    }
}
