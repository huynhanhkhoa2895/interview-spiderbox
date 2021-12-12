import React,{useState,useEffect} from 'react';
import logo from './logo.svg';
import './assets/App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from './Login';
import { useDispatch, useSelector } from 'react-redux';
import { selectorUser } from './redux/selector';
import { updateState } from './redux/action';
import Home from './Component/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const _dispatch = useDispatch();
  const _updateState = (key : string,value : any) => _dispatch(updateState(key,value));
  const [user,setUser] = useState<any>(JSON.parse((localStorage.getItem("user") as any)))
  const _user = useSelector(selectorUser())
  useEffect(() => {
    if(localStorage.getItem("user") == null) setUser(null)
    else {      
      if(_user != null) setUser(_user)
      else if(user != null) {
        _updateState("user",user)
        setUser(user)
      }
    }   
  },[_user])
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/login" render={props => user == null ? <Login {...props} /> : <Redirect to={{ pathname: "/" }} />} />
          <Route path="/" render={props => user == null ? <Redirect to={{ pathname: "/login" }} /> : <Home {...props} />} />
        </Switch>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
