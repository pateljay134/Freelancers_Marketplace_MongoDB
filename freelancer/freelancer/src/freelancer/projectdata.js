
import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import axios from 'axios';
import Homepage from './homepage';
import './css/one-page-wonder.min.css';


class ProjectData extends React.Component{
    constructor(props) {
        super(props);
        this.state = {hired_bidder : null,average_days:null, days: null, usd: null, project_id : null, project_name : null, description : null, skills : null, employer : null, budget_range : null, total_bids : null}
    }
    componentDidMount() {
        var project_details = { project_id : window.sessionStorage.getItem("project_id")}
        axios.post('http://localhost:3001/projectfetch', project_details)
        .then(res => {
            this.setState({
                project_id : res.data.rows.project_id,
                employer : res.data.rows.employer,
                project_name : res.data.rows.title,
                description : res.data.rows.description,
                skills : res.data.rows.skills_required,
                budget_range : res.data.rows.budget_range,
                average_days : res.data.result,
                hired_bidder : res.data.rows.hiredbidder
            })
        });
    }

	render(){
        console.log(this.state);
        if(window.sessionStorage.logged_in !== null){
		return(
            <div className="limiter">
                            Project Name : <div className="wrap-input100 validate-input m-b-16" >
						        <input className="input100" type="email" name="username" placeholder={this.state.project_name} readOnly/>
						        <span className="focus-input100"></span>
					        </div>
                            Description : <div className="wrap-input100 validate-input m-b-16" >
                                <input className="input100" type="number" name="phone_number" placeholder={this.state.description} readOnly/>
                                <span className="focus-input100"></span>
                            </div>
                            Skills Required : <div className="wrap-input100 validate-input m-b-16" >
						        <input className="input100" type="text" name="about_me" placeholder={this.state.skills} readOnly/>
						        <span className="focus-input100"></span>
					        </div>
                            Employer : <div className="wrap-input100 validate-input m-b-16" >
                                <input className="input100" type="text" name="skills" placeholder={this.state.employer} readOnly/>
                                <span className="focus-input100"></span>
                            </div>

                            Budget Range : <div className="wrap-input100 validate-input m-b-16" >
                                <input className="input100" type="text" name="skills" placeholder={this.state.budget_range} readOnly/>
                                <span className="focus-input100"></span>
                            </div>
                            Average Days : <div className="wrap-input100 validate-input m-b-16" >
                                <input className="input100" type="text" name="skills" placeholder={this.state.average_days} readOnly/>
                                <span className="focus-input100"></span>
                            </div>

	        </div>
        )
    } else{
        return(<div>
            <Homepage/>
        </div>
        )
        }
    }
}

export default ProjectData;
