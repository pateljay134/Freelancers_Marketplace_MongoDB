

import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
// import DisplayProjects from './displayprojects';
import axios from 'axios';
import SignIn from './signin'
// import Homepage from './homepage';
import ProjectData from './projectdata'
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';
//import { debug } from 'util';


class AddBid extends React.Component{
    constructor(props) {
        super(props);
        this.state = {session_exist : null, file: '', filename:null ,comment : null, days: null, usd: null, hired_bidder : null, status : null, project_id : null, project_name : null, description : null, skills : null, employer : null, budget_range : null, total_bids : null}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDays = this.handleDays.bind(this);
        this.handleUSD = this.handleUSD.bind(this);
        this.handleProgress = this.handleProgress.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    handleSubmit(e){
        debugger
        e.preventDefault();
        var project_data = {
            project_id : this.state.project_id , 
            title : this.state.project_name,
            description : this.state.description,
            skills_required : this.state.skills,
            employer : this.state.employer,
            budget_range : this.state.budget_range,
            status : this.state.status
        }

        var val = {project_data : project_data, project_id : window.sessionStorage.getItem("project_id"), days: this.state.days, usd : this.state.usd, employer : this.state.employer, bidder_email: window.sessionStorage.getItem("email"), bidder_name: window.sessionStorage.getItem("name")}
        axios.post('http://localhost:3001/addbid', val)
        .then(res => {
            
            var bid_added = res.data.bid_added;
            if(bid_added){
                window.location.href = 'http://localhost:3000/Dashboard';
            }
        });
    }

    handleDays(e){
        this.setState({
            days : e.target.value
        })
    }

    handleUSD(e){
        this.setState({
            usd : e.target.value
        })
    }
    handleClick(e){
        e.preventDefault();
        window.location.href = "http://localhost:3000/adminaction"
    }
    componentWillMount() {
        debugger
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
                status : res.data.rows.status,
                hired_bidder : res.data.rows.hiredbidder
            })
        });
    }
    handleComment(e){
        e.preventDefault();
        this.setState({
            comment : e.target.value
        })
    }
    handleFile(e){
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
            });
        }
        reader.readAsDataURL(file)
    }
    handleProgress(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('id', 1);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        var progress_added;
        formData.append('comment', this.state.comment);
        formData.append('project_id', this.state.project_id);
        formData.append('hired_bidder', this.state.hired_bidder);

        axios.post('http://localhost:3001/projectprogress', formData,config)
        .then(res => {
            progress_added= res.data.project_added
            if(progress_added){
                alert("progress added")
                window.location.href = "http://localhost:3000/workspot"
            }
            // window.location.href = "http://localhost:3000/Profile"
            // this.props.history.push('/addproject');
        })
    }



	render(){
        debugger
        if(window.sessionStorage.getItem("logged_in")){

            if(this.state.employer !== window.sessionStorage.getItem("email") && this.state.hired_bidder !== window.sessionStorage.getItem("email")){
                return(
                    <div className="limiter">
                        <div className="container-login100">
                            <div className="wrap-login100 p-t-50 p-b-90">
                                <form method = "POST" className="login100-form validate-form flex-sb flex-w">
                                    <span className="login100-form-title p-b-51"> Project Details</span>
                                <ProjectData/>
                                    <span className="login100-form-title p-b-51"> Bid for the Project</span>
                                    <div className="wrap-input100 validate-input m-b-16" >
                                        <input className="input100" type="number" name="skills" onChange = {this.handleDays} placeholder="Days" required/>
                                        <span className="focus-input100"></span>
                                    </div>
                                    <div className="wrap-input100 validate-input m-b-16" >
                                        <input className="input100" type="number" name="skills" onChange = {this.handleUSD} placeholder="USD/hour" required />
                                        <span className="focus-input100"></span>
                                    </div>

                                    <div className="container-login100-form-btn m-t-17">
                                        <input type="submit" className="login100-form-btn" value="Submit Bid" onClick = {this.handleSubmit}/>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
           
                )
            }else if(this.state.hired_bidder === window.sessionStorage.getItem("email")){
                return(
                    <div className="limiter">
                        <div className="container-login100">
                            <div className="wrap-login100 p-t-50 p-b-90">
                                <form method = "POST" className="login100-form validate-form flex-sb flex-w">
                                    <span className="login100-form-title p-b-51"> Project Details</span>
                                <ProjectData/>
        
                                </form>
                                <form>
                                <div className="validate-input m-b-16" >
                                    Note: You are hired for this project. Give your input
                                </div>
                                <div className="input100" data-validate = "File is required">
                                    <input type="file" onChange={this.handleFile} className="input100" style = {{marginTop:10}}/><br />
                                </div>
                                <div className="wrap-input100 validate-input m-b-16" data-validate = "Add Comments">
                                    <input className="input100" type="text" name="comment-box" required onChange = {this.handleComment} placeholder="Add Comments" />
                                    <span className="focus-input100"></span>
					            </div>
                                {/* <button className="login100-form-btn-bid" style={{width:"100%"}} value  = {this.props.project_id} onClick = {this.handleClick}>Submit Project Progress</button> */}
                                <div className="container-login100-form-btn m-t-17">
                                    <input type="submit" className="login100-form-btn" value="Add Project Progress" onClick = {this.handleProgress}/>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )    
            }else{
                return(
                    <div className="limiter">
                        <div className="container-login100">
                            <div className="wrap-login100 p-t-50 p-b-90">
                                <form method = "POST" className="login100-form validate-form flex-sb flex-w">
                                    <span className="login100-form-title p-b-51"> Project Details</span>
                                <ProjectData/>
        
                                </form>
                                <button className="login100-form-btn-bid" style={{width:"100%"}} value  = {this.props.project_id} onClick = {this.handleClick}>View Bidders</button>
                            </div>
                        </div>
                    </div>
                )    
            }
        } else{
            return(
                <SignIn/>
            )
        }
    }
}

export default AddBid;
