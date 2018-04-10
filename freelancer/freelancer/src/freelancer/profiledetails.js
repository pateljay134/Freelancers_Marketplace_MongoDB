import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import axios from 'axios';
class ProfileDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state = {bidderprofile:null,bidderprofilename:null, name: null, email: null, phone_number: null, skills: null , about_me : null, password : null};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handlePhoneNumber = this.handlePhoneNumber.bind(this);
        this.handleAboutMe = this.handleAboutMe.bind(this);
        this.handleSkills = this.handleSkills.bind(this);
    }
    componentWillMount() {
            var profile = {email : window.sessionStorage.getItem("email")}
            
            axios.post('http://localhost:3001/profilefetch', profile)
            .then(res => {
                
                // console.log(res.data.rows)
                this.setState({
                    name : res.data.rows.name, 
                    email: res.data.rows.email
                })
                if(typeof res.data.rows.phone_number === "undefined")
                this.setState({
                    phone_number: null
                })
                if(typeof res.data.rows.skills === "undefined")
                this.setState({
                    skills: null
                })
                if(typeof res.data.rows.about_me === "undefined")
                this.setState({
                    about_me : null
                })
                else{
                    this.setState({
                        phone_number : res.data.rows.phone_number,
                        skills : res.data.rows.skills,
                        about_me : res.data.rows.about_me
                    })
                }
                    
            });
        
    }

    handleName(e){
        this.setState({
            name : e.target.value
        })
    }
    handlePhoneNumber(e){
        this.setState({
            phone_number : e.target.value
        })
    }
    handleAboutMe(e){
        this.setState({
            about_me : e.target.value
        })
    }
    handleSkills(e){
        this.setState({
            skills : e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        var val = {name: this.state.name, email: this.state.email, phone_number: this.state.phone_number, skills: this.state.skills, about_me: this.state.about_me}
        axios.post('http://localhost:3001/profileupdate', val)
        .then(res => {
            
            var data_inserted = res.data.data_inserted;
            if(data_inserted){
                alert('update successful');
                window.location.href = "http://localhost:3000/Profile"
                // this.props.history.push('/');
            }
        });

    }

	render(){
        
        if(window.sessionStorage.getItem("bidderprofile")==="true"){

		return(
			<form method = "POST" className="login100-form validate-form flex-sb flex-w">
					        {/* <span className="login100-form-title p-b-51"> Profile </span> */}
                            Name : <div className="wrap-input100 validate-input m-b-16" data-validate = "Name is required">
						        <input className="input100" type="text" name="Name"  placeholder={this.state.name }  readOnly/>
						        <span className="focus-input100"></span>
					        </div>
                            Phone Number : <div className="wrap-input100 validate-input m-b-16" data-validate = "Phone Number is required">
                                <input className="input100" type="number" min = '1111111111' max = '9999999999' name="phone_number" onChange = {this.handlePhoneNumber.bind(this)} placeholder={this.state.phone_number!==null ? this.state.phone_number : "Enter Your Phone Number"} readOnly/>
                                <span className="focus-input100"></span>
                            </div>
                            What You Are : <div className="wrap-input100 validate-input m-b-16" data-validate = "About Me">
						        <input className="input100" type="text" name="about_me" required onChange = {this.handleAboutMe.bind(this)} placeholder={this.state.about_me!==null ? this.state.about_me : "Enter Something About You"}  readOnly/>
						        <span className="focus-input100"></span>
					        </div>
                            Your Skills : <div className="wrap-input100 validate-input m-b-16" data-validate = "Skills">
                                <input className="input100" type="text" name="skills" required onChange = {this.handleSkills.bind(this)} placeholder={this.state.skills!==null ? this.state.skills : "Enter Your Skills"} readOnly/>
                                <span className="focus-input100"></span>
                            </div>

                            {/* <div className="flex-sb-m w-full p-t-3 p-b-24">
                                <div>
                                    <a href="#" onClick = {this.handleClick} className="txt1">
                                        Update Profile ?
                                    </a>
                                </div>
					        </div> */}

                            {/* <div className="container-login100-form-btn m-t-17">
                                <input type="submit" className="login100-form-btn" value="Update Profile" onClick = {this.handleSubmit}/>
                            </div> */}

				        </form>
        )
    }else{
        return(
            <div>
                   
                    <form method = "POST" className="login100-form validate-form flex-sb flex-w">
					        {/* <span className="login100-form-title p-b-51"> Profile </span> */}
                            Name : <div className="wrap-input100 validate-input m-b-16" data-validate = "Name is required">
						        <input className="input100" type="text" name="Name"  placeholder={this.state.name }  />
						        <span className="focus-input100"></span>
					        </div>
                            Phone Number : <div className="wrap-input100 validate-input m-b-16" data-validate = "Phone Number is required">
                                <input className="input100" type="number" min = '1111111111' max = '9999999999' name="phone_number" onChange = {this.handlePhoneNumber.bind(this)} placeholder={this.state.phone_number!==null ? this.state.phone_number : "Enter Your Phone Number"}/>
                                <span className="focus-input100"></span>
                            </div>
                            What You Are : <div className="wrap-input100 validate-input m-b-16" data-validate = "About Me">
						        <input className="input100" type="text" name="about_me" required onChange = {this.handleAboutMe.bind(this)} placeholder={this.state.about_me!==null ? this.state.about_me : "Enter Something About You"}/>
						        <span className="focus-input100"></span>
					        </div>
                            Your Skills : <div className="wrap-input100 validate-input m-b-16" data-validate = "Skills">
                                <input className="input100" type="text" name="skills" required onChange = {this.handleSkills.bind(this)} placeholder={this.state.skills!==null ? this.state.skills : "Enter Your Skills"}/>
                                <span className="focus-input100"></span>
                            </div>

                            {/* <div className="flex-sb-m w-full p-t-3 p-b-24">
                                <div>
                                    <a href="#" onClick = {this.handleClick} className="txt1">
                                        Update Profile ?
                                    </a>
                                </div>
					        </div> */}

                            <div className="container-login100-form-btn m-t-17">
                                <input type="submit" className="login100-form-btn" value="Update Profile" onClick = {this.handleSubmit}/>
                            </div>

				        </form>

            </div>
        )
    }
    }
}

export default ProfileDetails; 