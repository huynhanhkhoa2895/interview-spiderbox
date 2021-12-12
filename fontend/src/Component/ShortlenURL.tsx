import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { callApiGetView, callApiShortlenURL } from '../api';
import { validateDomain, validateUrl } from '../helper';
import { faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useParams } from 'react-router-dom';
export default (props: any) => {
    const {id} = useParams<any>()
    const [domain,setDomain] = useState("http://localhost:3000")
    const [inputNameValue,setInputNameValue] = useState("")
    const [inputValue,setInputValue] = useState("")
    const [shortlenValue,setShortlenValue] = useState("")
    const [loading,setLoading] = useState(false)

    useEffect(() =>{
        const getView = async () => {
            const result : any = await callApiGetView("url",id)
            const data = result.data?.data;
            setDomain(data.domain)
            setInputNameValue(data.name)
            setInputValue(data.url)
            setShortlenValue(data.shorten_url)
        }
        if(id != null){
            getView()            
        }
    },[])
    const onChangeValue = (type : string,value : string) => {
        switch(type){
            case "url" : 
                setInputValue(value)
                break;
            case "name" : 
                setInputNameValue(value)
                break;
            case "domain":
                setDomain(value)
                break;
        }
        
    }
    const startShortlenUrl = async () => {
        setLoading(true)
        let newDomain = domain
        if(validateDomain(newDomain)){
            if(/^(?:(ftp|http|https):\/\/)/.test(newDomain) === false){
                newDomain = "https://"+newDomain;
            }
        }
        if(validateUrl(inputValue)){
            let value = inputValue;
            if(/^(?:(ftp|http|https):\/\/)/.test(value) === false){
                value = "https://"+value;
                setInputValue(value)
            }
            const result : any = await callApiShortlenURL({url : value,name : inputNameValue,domain : newDomain});
            const data = result.data;
            if(data.err === 0){
                let shorten_url = data?.data?.shorten_url;
                setShortlenValue(shorten_url)
                setDomain(data?.data?.domain)
            }else{
                toast.error(data.msg || "Error has occured")
            }
        }else{
            toast.error("String is not url")
        }
        setLoading(false)
    }
    return(
        <div style={{paddingTop : 10}}>
            <Link to="/url/list">Go to List</Link>
            <div className="card" style={{"width":"50%",margin : "auto"}}>
                <div className="card-body">
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input 
                            className={"form-control"}
                            value={inputNameValue || ""}
                            onChange={(e : any)=>onChangeValue("name",e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Enter a long URL to make a TinyURL</label>
                        <input 
                            className={"form-control"}
                            value={inputValue || ""}
                            onChange={(e : any)=>onChangeValue("url",e.target.value)}
                        />
                    </div>
                    {
                        id != null && (
                            <div className="form-group">
                                <label className="form-label">Select Domain</label>
                                <input 
                                    className={"form-control"}
                                    value={domain || ""}
                                    onChange={(e : any)=>onChangeValue("domain",e.target.value)}
                                />
                            </div>
                        )
                    }
                    <div className="form-group">
                        <label className="form-label">Customize your link</label>
                        <div className="input-group mb-3">
                            {
                                shortlenValue === "" && 
                                <select value={domain} onChange={(e : any)=>setDomain(e.value)}>
                                    <option value="http://localhost:3000">localhost:3000</option>
                                </select>
                            }
                            <input 
                                className={"form-control"}
                                value={shortlenValue || ""}
                                onChange={(e : any)=> {return false}}
                            />
                        </div>

                    </div>
                    <div className="form-group">
                        <button className="btn btn-success" onClick={()=>startShortlenUrl()} disabled={loading}>
                        {
                            loading && (
                                <FontAwesomeIcon style={{marginRight : 10}} icon={faSpinner} spin />
                            )
                        }
                            Shortlen Url
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}