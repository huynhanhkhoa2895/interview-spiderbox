import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { callApiGetURL } from "../api"
import Loading from "./Loading"

export default (props: any) => {
    const history = useHistory()
    useEffect(()=>{
        const getUrl = async () => {
            const result : any = await callApiGetURL(window.location.href)
            const data = result.data
            if(data.err === 0){
                const url = data?.data.url
                return window.location.replace(url)
            }else{
                history.push("/")
            }
        }
        getUrl()
    },[])
    return(
        <>
            <Loading />
        </>
    )
}