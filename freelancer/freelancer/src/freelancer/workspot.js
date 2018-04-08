import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import UserProjects from './userprojects';
import UserBids from './userbids';
// import axios from 'axios';
// import UserDetails from './userdetails';
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';
//import { debug } from 'util';

class WorkSpot extends React.Component{
	render(){
        debugger
        if(window.sessionStorage.logged_in === "true"){
		return(
            <div className="limiter">
                <h3 style={{ marginTop:100}}><span className="login100-form-title p-b-51"> Your Projects </span></h3>
            <UserProjects/>
            <h3 style={{ marginTop:100}}><span className="login100-form-title p-b-51"> Projects You have bid on </span></h3>
            <UserBids/>
            </div>
        )
    } else{
        return(window.location.href = "http://localhost:3000"
        )
        }
    }
}

export default WorkSpot;
