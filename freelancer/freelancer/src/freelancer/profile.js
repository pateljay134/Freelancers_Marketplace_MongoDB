import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
// import axios from 'axios';
// import UserDetails from './userdetails';
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';
import ProfileImage from './profileimage';
import ProfileDetails from './profiledetails';
import BidderProfileDetails from './bidderprofiledetails';
import BidderProfileImage from './bidderprofileimage';
//import { debug } from 'util';

class Profile extends React.Component{
	render(){
        debugger
        if(window.sessionStorage.getItem("logged_in")){
            if(window.sessionStorage.getItem("bidderprofile")==="true"){
            return(
                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100 p-t-50 p-b-90">
                        <span className="login100-form-title p-b-51"> Profile </span>
                            <BidderProfileImage/>
                            
                            <BidderProfileDetails/>
                        </div>
                    </div>
                </div>
        )}else{
            return(
                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100 p-t-50 p-b-90">
                        <span className="login100-form-title p-b-51"> Profile </span>
                            <ProfileImage/>
                            <ProfileDetails/>
                        </div>
                    </div>
                </div>
            )}
    } else{
        return(window.location.href = "http://localhost:3000"
        )
        }
    }
}

export default Profile;
