import axios from "axios";
import { getCookie } from "./helper";
import $ from 'jquery';

export const DOMAIN = process.env.REACT_APP_API + "api/";
export const callApiLogin = (username: any, password: any) => {
    return axios.post(DOMAIN + "verify/login", { username: username, password: password }, {
    }).catch(error => handleError(error));
}
export const callApiLogout = () => {
    return axios.post(DOMAIN + "verify/logout", {},  {
        headers: header(),
    }).catch(error => handleError(error));
}
export const callApiGetList = (module : string,param : any = null,apiRoute : string = "/list") => {
    return axios.get(DOMAIN +module+apiRoute+"?"+$.param(param), {
        headers: header(),
    }).catch(error => handleError(error));
}
export const callApiGetView = (module : string,id : string = "",apiRoute : string = "/view") => {
    return axios.get(DOMAIN +module+apiRoute+"/"+id, {
        headers: header(),
    }).catch(error => handleError(error));
}
export const callApiGetDelete = (module : string,ids : Array<string>) => {
    return axios.delete(DOMAIN +module+"/deletes?"+$.param({ids : ids}), {
        headers: header(),
    }).catch(error => handleError(error));
}
export const callApiUpdateField = (module : string,param : any,field : string) => {
    return axios.post(DOMAIN + "/"+module+"/update/"+field, param, {
        headers: header(),
    }).catch(error => handleError(error));
}
export const callApiPostForm = (module: any, param : any) => {
    return axios.post(DOMAIN +module+ "/add", param, {
        headers: header(),
    }).catch(error => handleError(error));
}
export const callApiInsertForm = (module: any, param : any) => {
    return axios.post(DOMAIN +module+ "/insert", param, {
        headers: header(),
    }).catch(error => handleError(error));
}
export const callApiShortlenURL = (param : Object) => {
    return axios.post(DOMAIN + "shortUrl",param, {
        headers: header(),
    }).catch(error => handleError(error));
}
export const callApiGetURL = (url : string) => {
    return axios.get(DOMAIN + "getUrl?shorten_url="+url, {
        headers: header(),
    }).catch(error => handleError(error));
}
export const header = () => {
    const token = getCookie("token");
    return {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Bearer " + token
    }
}
const handleError = (err: any) => {
    if(err.response != null && err.response.status === 401){
        localStorage.removeItem("user")
        document.location.href = "/login?expired=true"
    }else{
        return {error : err}
    }
}
