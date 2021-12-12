
import { Switch,Route,Redirect, useHistory } from 'react-router-dom';
import { eraseCookie, initId } from '../helper';
import List from './List';
import Add from './Add';
import View from './View';
import { useDispatch } from 'react-redux';
import { updateState } from '../redux/action';
import { callApiLogout } from '../api';
import ShortlenURL from './ShortlenURL';
import { Fragment } from 'react';
import GetURL from './GetURL';

const listModule = ["user","url"];
export default (props: any) => {
    const history = useHistory()
    const distpatch = useDispatch();
    const _updateState = (key : any,value : any) => distpatch(updateState(key,value)) 

    const Logout = async () => {
        eraseCookie("token");
        callApiLogout()
        _updateState("user",null)    
        history.push("/login")
    }
    return(
        <div className="container">
            {/* <div className="row" style={{paddingTop : 10}}>
                <div className="col-12">
                    <button className="btn btn-danger" onClick={()=>Logout()}>Logout</button>
                </div>
            </div> */}
            <Switch>
                <Route
                    path={"/"}
                    exact={true}
                    render={props => (
                        <ShortlenURL />
                    )} 
                />
                <Route
                    path={"/url/list"}
                    exact={true}
                    render={props => (
                        <List menu={"url"} permission={{view : true,update : true,delete : true,create : true}} />
                    )} 
                />
                <Route
                    path={"/url/view/:id"}
                    exact={true}
                    render={props => (
                        <View menu={"url"} permission={{view : true,update : true,delete : true,create : true}} />
                    )} 
                />
                <Route
                    path={"/url/update/:id"}
                    exact={true}
                    render={props => (
                        <ShortlenURL />
                    )} 
                />
                <Route
                    path={"/:code"}
                    exact={true}
                    render={props => (
                        <GetURL />
                    )} 
                />
                <Redirect to="/"  />
            </Switch>
        </div>
    )
}