import md5 from 'md5'
export function initId() : string{
  return md5(new Date().getTime().toString()+Math.random()+Math.random()+Math.random())
}
export function empty(value : any){
    if(value instanceof Array){
      if(value.length === 0) return true;
    }
    if(value == null) return true
    switch(typeof value){
      case "object":
        if(Object.keys(value).length === 0) {
          return true
        }      
      break;
      case "boolean":
        if(!value) {
          return true
        }      
      break;
      default:
        if(value == null || value == '' ||typeof value === undefined){
          return true;
        }
    }
    return false
  }
  export function ucfirst(str: string){
    if(str == null) return '';
    const str2 = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return str2
}
export function setCookie(name : string,value : string,days : number = 1) {
    var expires = "";
    if (days) {
        var date : any = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export function getCookie(name : string) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
export function eraseCookie(name : string) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
export const validateEmail = (email : string) =>
  email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
export  function validateUrl(value : string) {
  return /^(?:(ftp|http|https):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  //
}
export function validateDomain(value : string){
  return /^(?:(ftp|http|https):\/\/)?((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/.test(value);
}