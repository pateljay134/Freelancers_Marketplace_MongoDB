import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import axios from 'axios';
// import {Redirect} from 'react-router';
// import Header from './header';
// import {Provider} from 'react-redux';
// import UserDetails from './userdetails';
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';

// const store = createStore(allReducers);

class SignIn extends React.Component{
    constructor(props) {
        super(props);
        this.state = { email: null, password: null, session_exist : null };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }
    componentWillMount(){
        axios.get('http://localhost:3001/checksession',{ withCredentials: true } )
        .then(res => {
            if(res.data.session_exist){
                this.setState({
                    session_exist : res.data.session_exist
                })
            }
        });
    }
   
    handleEmail(e){
        this.setState({
            email : e.target.value
        })
    }
    handlePassword(e){
        this.setState({
            password : e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();

        var val = {email: this.state.email, password: this.state.password}
        axios.post('http://localhost:3001/checkemail', val)
        .then(res => {
            if(!res.data.user_exist){
            document.getElementById('email').innerHTML = "This email does not exist"
            }
            else{
                axios.post('http://localhost:3001/signinprocess', val, { withCredentials: true } )
                .then(res => {
                    var logged_in = res.data.logged_in;
                    if(logged_in){
                        window.sessionStorage.setItem("email", this.state.email);
                        window.location.href = "http://localhost:3000/"
                    }else{
                        document.getElementById('email').innerHTML = "This email exists already"
                    }
                });
            }
        });
 
    }
	render(){
        
        if(!this.state.session_exist){
		return(
        // <Provider store = {store}>
            <div className="limiter">
		        <div className="container-login100">
			        <div className="wrap-login100 p-t-50 p-b-90">
				        <form method = "POST" className="login100-form validate-form flex-sb flex-w">
					        <span className="login100-form-title p-b-51"> Login </span>
                            <div className="wrap-input100 validate-input m-b-16" data-validate = "Email is required">
						        <input className="input100" type="email" name="email" required onChange = {this.handleEmail.bind(this)} placeholder="Email ID"/>
						        <span className="focus-input100"></span>
					        </div>
                            <p id="email" style={{color:'blue', marginBottom:5}}></p>
                            <div className="wrap-input100 validate-input m-b-16" data-validate = "Password is required">
                                <input className="input100" type="password" name="pass" required onChange = {this.handlePassword.bind(this)} placeholder="Password"/>
                                <span className="focus-input100"></span>
                            </div>

                            <div className="container-login100-form-btn m-t-17">
                                <input type="submit" className="login100-form-btn" value="SignIn" onClick = {this.handleSubmit}/>
                            </div>

				        </form>
			        </div>
		        </div>
	        </div>
            // {/* </Provider> */}
        )
    }else{
        return(
            window.location.href = "http://localhost:3000"
        )
    }
    }
    

    
}

export default SignIn;