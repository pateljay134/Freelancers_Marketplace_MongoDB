import React from 'react';
import './css/bootstrap.min.css';
import './css/one-page-wonder.min.css';

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
      WorkSpot : './workspot'
		}
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
  }

handleProfile(e){
  window.sessionStorage.setItem("bidderprofile",false)
  window.sessionStorage.setItem("bidderprofilename",null)
  window.location.href = "http://localhost:3000/Profile";
}

handleSignOut(e){
  // debugger
  window.sessionStorage.setItem("logged_in",false)
  window.sessionStorage.setItem("username",null)
  window.sessionStorage.setItem("password",null)  
  this.setState({ logged_in : false })
  if(window.sessionStorage.logged_in === "false"){
    // this.props.history.push('/');
    window.location.href = "http://localhost:3000/";
  }
}

	render(){
    // debugger
    if(window.sessionStorage.logged_in === "true"){
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
