import { useState,useEffect } from 'react';
import { callApiGetView } from '../api';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
const View = (props : any) => {
    const {id} = useParams<any>()

    const [param,setParam] = useState<any>({url : '',shorten_url : '',total_click : '',id : '',domain : ''})
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
    useEffect(() =>{
        const getView = async () => {
            const result : any = await callApiGetView(props.menu,id)
            const data = result?.data?.data;
            if(data != null){
                let newParam = {
                    url : data.url || '',
                    shorten_url : data.shorten_url || '',
                    domain : data.domain || '',
                    total_click : data.total_click || '',
                    id : id
                }
                setParam(newParam)
            }

        }
        getView()      
    },[])
    return (
        <div className="row" style={{paddingTop : 10}}>
            <div className="col-12">
                <Link to={"/"+props.menu+"/list"}>Back to list</Link>
            </div>
            <div className="col-12">
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th>Url</th>
                            <td>{param.url}</td>
                        </tr>
                        <tr>
                            <th>Shorten Url</th>
                            <td>{param.shorten_url}</td>
                        </tr>
                        <tr>
                            <th>Total Click</th>
                            <td>{param.total_click}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default View;