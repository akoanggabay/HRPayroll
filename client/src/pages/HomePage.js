import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
// components
import Sidebar from "../components/Sidebar";
import { Link } from "../link";
import { setLoggedInfo } from '../redux/actions/logged';
import { Routes } from "../routes";
import Signin from "./examples/Signin";
import FormLeave from "./form/leave";
import Leave from "./request/leave";
import OB from "./request/ob";
import OT from "./request/ot";
import Request from "./request/request";
// pages
import BootstrapTables from "./tables/BootstrapTables";
import UserProfile from "./user/profile";




/* 
const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => ( <> <Preloader show={loaded ? false : true} /> <Component {...props} /> </> ) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  

  return (
    <Route {...rest} render={props =>  (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        </main>
      </>
    )}
    />
  );

  
}; */
toast.configure();
const App = props => {
  //console.log(props)

  const users = useSelector(state => state.users);
  const logged = useSelector(state => state.logged.info.logged);
  const link = "http://10.168.2.8:5000/"
  const dispatch = useDispatch();

  //console.log(logged)

  const checkAuthenticated = async () => {
    //console.log(1)
    try {

      if(localStorage.token)
      {
          const res = await fetch(Link+"api/v1/auth/verify", {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseRes = await res.json();
    
      
        if(parseRes === true)
        {
          //console.log(parseRes);
        }
        else
        {
          toast.warning("Login session expired.",{
            position: toast.POSITION.TOP_CENTER
          });
          localStorage.removeItem("token");
        }
        //parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        parseRes === true ? dispatch(setLoggedInfo({logged: true})) : dispatch(setLoggedInfo({logged: false}))
      }
      

      
      
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
    setInterval(function () {checkAuthenticated()}, 1000 * 60);
  }, []);

  /* const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  }; */

  return (
    <Fragment>
      <Router>
        <Switch>
            <Route 
              exact path="/login" render={props => !logged ? ( <Fragment><Signin {...props} setAuth={logged} /></Fragment> ) : ( <Redirect to = {Routes.BootstrapTables.path} />)}
            />
            <Route>
              <main className="content">
                <Route exact path={Routes.BootstrapTables.path} render={props => logged ? ( <Fragment><Navbar/><Sidebar/><BootstrapTables {...props} setAuth={logged} idno={users} /><Footer/></Fragment> ) : ( <Redirect to = "/login" />)} />
                <Route exact path={Routes.OT.path} render={props => logged ? ( <Fragment><Navbar/><Sidebar/><OT {...props} setAuth={logged} /><Footer/></Fragment> ) : ( <Redirect to = "/login" />)} />
                <Route exact path={Routes.OB.path} render={props => logged ? ( <Fragment><Navbar/><Sidebar/><OB {...props} setAuth={logged} /><Footer/></Fragment> ) : ( <Redirect to = "/login" />)} />
                <Route exact path={Routes.Leave.path} render={props => logged ? ( <Fragment><Navbar/><Sidebar/><Leave {...props} setAuth={logged} /><Footer/></Fragment> ) : ( <Redirect to = "/login" />)} />
                <Route exact path={Routes.Req.path} render={props => logged ? ( <Fragment><Navbar/><Sidebar/><Request {...props} setAuth={logged} /><Footer/></Fragment> ) : ( <Redirect to = "/login" />)} />
                <Route exact path={Routes.FormLeave.path} render={props => logged ? ( <Fragment><Navbar/><Sidebar/><FormLeave {...props} setAuth={logged} /><Footer/></Fragment> ) : ( <Redirect to = "/login" />)} />
                <Route exact path={Routes.UserProfile.path} render={props => logged ? ( <Fragment><Navbar/><Sidebar/><UserProfile {...props} setAuth={logged} /><Footer/></Fragment> ) : ( <Redirect to = "/login" />)} />
              </main>
          </Route>
        </Switch>
    </Router>
  </Fragment>
  );
}



export default App;
