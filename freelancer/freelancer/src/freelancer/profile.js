import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import axios from 'axios';
import SignIn from './signin';
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
    constructor(props){
        super(props);
        this.state = { session_exist : null };
        this.viewBalance = this.viewBalance.bind(this);
    }
    viewBalance(e){
        e.preventDefault();
        window.location.href = "http://localhost:3000/payment"
    }
	render(){
        
        if(window.sessionStorage.getItem("logged_in")){
            console.log("Hello")
            debugger
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

                            <button className="txt1 txt2" onClick={this.viewBalance}>
                                View Balance
                            </button>
                    </div>
            )}
        }else{
            return(
                <SignIn/>
            )
        }
    }
}

export default Profile;
