import React from 'react';
import './css/bootstrap.min.css';
import './css/one-page-wonder.min.css';
import axios from 'axios';

class Header extends React.Component{
  constructor(props){
    super(props)
		this.state = {
      Profile : './Profile',
      SignOut : './SignOut',
      AddProject : './AddProject',
      SignIn : './SignIn',
      SignUp  : './SignUp',
      Dashboard  : './Dashboard',
      WorkSpot : './workspot',
      session_exist : null
		}
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
  }
  componentWillMount(){
    debugger
    axios.get('http://localhost:3001/checksession',{ withCredentials: true } )
    .then(res => {
      debugger
        if(res.data.session_exist){
            this.setState({
                session_exist : res.data.session_exist
            })
        }
    });
  }
handleProfile(e){
  window.sessionStorage.setItem("bidderprofile",false)
  window.sessionStorage.setItem("bidderprofilename",null)
  window.location.href = "http://localhost:3000/Profile";
}

handleSignOut(e){ 
  axios.get('http://localhost:3001/signout',{ withCredentials: true } )
    .then(res => {
      debugger
        if(!res.data.session_exist){
            this.setState({
                session_exist : res.data.session_exist
            })
            window.location.href = "http://localhost:3000/"
        }
    });
}

	render(){
    if(this.state.session_exist){
      return(
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
          <div className="container">
            <a href="/"><img src={require("../images/freelancer.png")} style={{width:50}} alt="Freelancer"/></a>
            <a className="navbar-brand" href="/">FreeLancer</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link" value = 'Dashboard' href = {this.state.Dashboard} >Dashboard</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" value = 'WorkSpot' href = {this.state.WorkSpot} >WorkSpot</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" value = 'Profile' href = {this.state.Profile} onClick={this.handleProfile} >Profile</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" value = 'AddProject' href = {this.state.AddProject} >Add Project</a>
                </li>
                <li className="nav-item">
                  <button className="nav-link" value = 'SignOut' onClick = {this.handleSignOut} >Sign Out</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )
    }
    else{
      return(
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
          <div className="container">
            <a href="/"><img src={require("../images/freelancer.png")} style={{width:50}} alt="Freelancer"/></a>
            <a className="navbar-brand" href="/" >FreeLancer</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
              
                <li className="nav-item">
                  <a className="nav-link" value = 'SignUp' href = {this.state.SignUp} >Sign Up</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" value = 'SignIn' href = {this.state.SignIn} >Log In</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )
    }
  }
}



export default Header; 
