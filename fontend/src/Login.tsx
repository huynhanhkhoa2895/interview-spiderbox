
import { useEffect, useState,useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { callApiLogin, DOMAIN } from './api'
import { faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { updateState } from './redux/action'
import { setCookie } from './helper';
import "./assets/verify.scss"
export default (props: any) => {
    const history = useHistory()
    const distpatch = useDispatch();
    const [email, setEmail] = useState<any>("")
    const [password, setPassword] = useState<any>("")
    const [err, setErr] = useState<any>("")
    const [errPass, setErrPass] = useState(false)
    const [errEmail, setErrEmail] = useState<any>(false)
    const [loading,setLoading] = useState(false)
    const _updateState = (key: any, value: any) => distpatch(updateState(key, value))
    const inputChange = (type: any, event: any) => {
        if (type === "email") {
            setEmail(event.target.value)
        } else {
            setPassword(event.target.value)
        }
    }
    const handleLogin = async () => {
        if (email === "") {
            setErrEmail(true)
            setErr("")
        }
        if (password === "") {
            setErrPass(true)
            setErr("")
        }
        if (email != "" && password != "") {
            let check = true;
            if(check){
                setErrEmail(false)
                setErrPass(false)
                setLoading(true)
                const result : any = await callApiLogin(email, password)
                let data = result.data;
                if (data.err === 1) {
                    setErr("Email or Password was error")
                    setLoading(false)
                }else if(data.err === 2){
                    setErr("Account not allow to access, please contact admin")
                    setLoading(false)
                }else if(data.err === 3){
                    setErr("Your account has been locked, please contact admin")
                    setLoading(false)
                } else {
                    data = data.data
                    localStorage.setItem("user", JSON.stringify({...data.user}))
                    setCookie("token",data.token)
                    _updateState("user",data.user)
                    history.push("/")                    
                }
            }
        }
    }
    const handleKeypress = (e: any) => {
        if (e.charCode === 13) {
            handleLogin()
        }
    }
    return(
        <div id="formLogin" className="wrapper ">
            <form className="formLogin" onKeyPress={(e)=>handleKeypress(e)}>
                {
                    err && (
                        <div className="alert alert-danger">
                        {err}
                        </div>
                    )
                }
                <input value={email} className="form-control" type="text" placeholder="Email or Phone" autoComplete="username" onChange={(e) => inputChange("email", e)} required />
                {
                    errEmail && (
                    <div className="help-block">
                        Email is required
                    </div>
                    )
                }
                <input  value={password} className="form-control" type="password" placeholder="Password" autoComplete="current-password" onChange={(e) => inputChange("password", e)} required />
                {
                    errPass && (
                    <div className="help-block">
                        Password is required
                    </div>
                    )
                }
                <div className="row" style={{padding : 10}}>
                    <div className="md-12">
                        <button className="btn btn-success btn-block" onClick={()=>handleLogin()} disabled={loading}>
                            {
                                loading && (
                                    <FontAwesomeIcon style={{marginRight : 10}} icon={faSpinner} spin />
                                )
                            }
                            
                            <span>Đăng nhập</span>
                        </button>
                    </div>
                </div>
                
            </form>
        </div>
    )
}
