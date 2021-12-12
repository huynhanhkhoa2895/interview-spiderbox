<?php
namespace App\Repository;
use DB;
class BaseRespository
{
    protected $_model;
    protected $_module;
    protected $list;
    function __construct($module){
        $this->setModel($module);
        $this->_module = $module;
    }
    function setModel($module){
        $n = '';
        foreach(explode("_",$module) as $name){
            $n.= ucfirst($name);
        }
        $obj = "\\App\Models\\".$n;
        $this->_model = new $obj;
    }
    function loadModel($module){
        $n = '';
        foreach(explode("_",$module) as $name){
            $n.= ucfirst($name);
        }
        $obj = "\\App\Models\\".$n;
        return new $obj;
    }
    public function find($id){
        return $this->_model->find($id);
    }
    public function first($where = []){
        return $this->_model->where($where)->first();
    }
    public function getNameModule()
    {
        return $this->_module;
    }
    public function list($search = [])
    {
        return $this->_model->all();
    }
    public function checkUserExist($email,$phone = null) : bool{
        $query = $this->_model->where("email",$email);
        if(!empty($email)){
            $query = $query->orWhere("phone",$phone);
        }
        if(empty($query->first())){
            return false;
        }else{
            return true;
        }
    }
    public function crudList($option = [])
    {
        $select = empty($option["select"]) ? ["*"] : $option["select"];
        $limit = $option["pagination"] == 0 ? null : ($option["limit"] ?? 10);
        $order = $option["order"] ?? ["id","desc"];
        $search = $option["search"] ?? [];
        $pagination = $option["pagination"] ?? 1;
        $skip = ($pagination - 1) * $limit;
        $query = $this->_model->select($select);
        $queryAll = $this->_model;
        if(!empty($order)){
            $query = $query->orderBy($order[0],$order[1]);
        }
        if(!empty($search) && !empty($search[0])){
            foreach($search[0] as $k=>$item){
                if(!empty($search[1])){
                    if($k == 0){
                        $query = $query->where($item, 'LIKE', "%{$search[1]}%");
                        $queryAll = $queryAll->where($item, 'LIKE', "%{$search[1]}%");
                    }else{
                        $query = $query->orWhere($item, 'LIKE', "%{$search[1]}%");
                        $queryAll = $queryAll->where($item, 'LIKE', "%{$search[1]}%");
                    }
                }

            }
        }
        if(!empty($limit)){
            $query = $query->skip($skip)->take($limit);
        }        
        return ["data"=>$query->get(),"total"=>$queryAll->count()];        
    }
    public function setList($arr)
    {
        return $this->list = $arr;
    }
    function getAllField($module = null){
        $schema = DB::getSchemaBuilder();
        $fields = [];
        $_module = $module ?? $this->_module;
        foreach($schema->getColumnListing($_module) as $field){
            if(in_array($field,$this->getHidden())) continue;
            $fields[$field] =  $schema->getColumnType($_module,$field);
        }
        return $fields;
    }
    function getHidden(){
        return $this->_model->getHidden();
    }
    function storeData($form,$newmodel = null){
        try{            
            if(!empty($newmodel)){
                $_model = $this->loadModel($newmodel);
            }else{
                $_model = $this->_model;
            }
            if(empty($form["id"])){
                $model = new $_model;
    
            }else{            
                $model = $_model->find($form["id"]);
            }
            
            foreach($form as $field=>$value){
                $model->$field = $value;
            }
            $model->save();
            return $model;
        }catch(Exception $e){
            dd("error",$e);
        }
        
    }
    function delete(String $id){
        $this->_model->find($id)->delete();
    }
    function deletes(Array $ids){
        $this->_model->whereIn("id",$ids)->delete();
    }
    function checkImageExist($form) : bool {
        $data = $this->_model->find($form["id"]);
        if(!empty($data) && !empty($form['img'])){
            if($data->img === $form['img']){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
}
