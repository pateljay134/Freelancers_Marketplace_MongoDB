import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import axios from 'axios';
class BidderProfileDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state = {bidderprofile:null,bidderprofilename:null, name: null, username: null, phone_number: null, skills: null , about_me : null, password : null};
    }
    componentWillMount() {
        var bidderprofileemail = window.sessionStorage.getItem("bidderprofileemail")
        // var bidderprofile = window.sessionStorage.getItem("bidderprofile")
        debugger

            window.sessionStorage.setItem("bidderprofile",false)
            var profile = {email : bidderprofileemail}
            debugger
            axios.post('http://localhost:3001/profilefetch', profile)
            .then(res => {
                debugger
                this.setState({
                    name : res.data.rows.name, 
                    username: res.data.rows.username,
                    phone_number: res.data.rows.phone_number, 
                    skills: res.data.rows.skills, 
                    about_me : res.data.rows.about_me,
                    password : res.data.rows.password
                })

            });

    }

	render(){
		return(
			<form method = "POST" className="login100-form validate-form flex-sb flex-w">
					        {/* <span className="login100-form-title p-b-51"> Profile </span> */}
                            Name : <div className="wrap-input100 validate-input m-b-16" data-validate = "Name is required">
						        <input className="input100" type="text" name="Name"  placeholder={this.state.name }  readOnly/>
						        <span className="focus-input100"></span>
					        </div>
                            Phone Number : <div className="wrap-input100 validate-input m-b-16" data-validate = "Phone Number is required">
                                <input className="input100" type="number" min = '1111111111' max = '9999999999' name="phone_number" placeholder={this.state.phone_number!==null ? this.state.phone_number : "Not Available"} readOnly/>
                                <span className="focus-input100"></span>
                            </div>
                            About : <div className="wrap-input100 validate-input m-b-16" data-validate = "About Me">
						        <input className="input100" type="text" name="about_me" required placeholder={this.state.about_me!==null ? this.state.about_me : "Not Available"}  readOnly/>
						        <span className="focus-input100"></span>
					        </div>
                            Skills : <div className="wrap-input100 validate-input m-b-16" data-validate = "Skills">
                                <input className="input100" type="text" name="skills" required placeholder={this.state.skills!==null ? this.state.skills : "Not Available"} readOnly/>
                                <span className="focus-input100"></span>
                            </div>

				        </form>
        )
    }
}

export default BidderProfileDetails; 