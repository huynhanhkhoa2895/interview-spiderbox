import { useState,useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { toast } from "react-toastify"
import { callApiGetView, callApiPostForm } from "../api"
import { empty, initId } from "../helper"

export default (props: any) => {
    const {id} = useParams<any>()
    const history = useHistory()

    const [isValidate,setIsValidate] = useState<any>(false)
    const [isLoading, setLoading] = useState<any>(true)
    const [param,setParam] = useState<any>({url : '',shorten_url : '',total_click : '',id : ''})
    const [err,setErr] = useState<string>("");
    useEffect(() =>{
        const getView = async () => {
            const result : any = await callApiGetView(props.menu,id)
            const data = result.data?.data;
            let newParam = {
                url : data.url || '',
                shorten_url : data.shorten_url || '',
                total_click : data.total_click || '',
                id : id
            }
            setParam(newParam)
        }
        if(id != null){
            getView()            
        }
    },[])
    const handleChange = (type : string,value : string | number) => {
        const newParam = {...param}
        newParam[type]=value
        setParam(newParam)
    }
    function onSubmit(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setIsValidate(true);
        setLoading(true);
        let check = true
        const _param : any = {...param}

        Object.keys(_param).map((key : string)=>{
            const item = _param[key]
            if(id == null){
                if(empty(item)){
                    check = false
                }
            }else{
                if(key != "password" && key != "repassword" && empty(item)){
                    check = false
                }
            }

        })
        if(check){
            if(!empty(_param.password)){
                if(_param.password === _param.repassword){
                    postData()
                    setErr("")
                }else{
                    setErr("Password and Re-password not match")                
                }
            }else{
                postData()
                setErr("")
            }            

        }else{
            setErr("Field is empty")
        }
        setLoading(false);

    }
    const postData = async () => {
        console.log(`param`,param)
        const result: any = await callApiPostForm("user",param)
        const data = result.data;
        console.log(`data`,data)
        if(data.err === 0){
            toast.success("Add success")
            history.push("/user/list")
        }else{
            setErr(data.msg)
        }
        
    }
    return(
        <div className="row" style={{paddingTop: 10}}>
            <div className="col-12">
            <form onSubmit={(e: any) => onSubmit(e)}>
                {
                    !empty(err) && (
                        <>
                            <div className="alert alert-danger" role="alert">
                                {err}
                            </div>
                        </>
                    )
                }
                <div className="form-group">
                    <label>Name <span style={{color : "red"}}>*</span></label>
                    <input className="form-control" value={param.name || ""} onChange={(e : any)=>handleChange("name",e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Email <span style={{color : "red"}}>*</span></label>
                    <input className="form-control" value={param.email || ""} onChange={(e : any)=>handleChange("email",e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Phone <span style={{color : "red"}}>*</span></label>
                    <input className="form-control" value={param.phone || ""} onChange={(e : any)=>handleChange("phone",e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input className="form-control" value={param.password || ""} type="password" onChange={(e : any)=>handleChange("password",e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Re-Password</label>
                    <input className="form-control" value={param.repassword || ""} type="password" onChange={(e : any)=>handleChange("repassword",e.target.value)} />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
            </div>
        </div>
    )
}