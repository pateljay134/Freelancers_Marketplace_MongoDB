

import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
// import DisplayProjects from './displayprojects';
import axios from 'axios';
// import Homepage from './homepage';
import ProjectData from './projectdata'
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';
//import { debug } from 'util';


class ProjectAction extends React.Component{
    constructor(props) {
        super(props);
        this.state = {days: null, usd: null, status : null, project_id : null, project_name : null, description : null, skills : null, employer : null, budget_range : null, total_bids : null}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDays = this.handleDays.bind(this);
        this.handleUSD = this.handleUSD.bind(this);
    }

    handleSubmit(e){
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
            debugger
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

    componentDidMount() {
        debugger
        var project_details = { project_id : window.sessionStorage.getItem("project_id")}
        debugger
        axios.post('http://localhost:3001/projectfetch', project_details)
        .then(res => {
            this.setState({
                project_id : res.data.rows.project_id,
                employer : res.data.rows.employer,
                project_name : res.data.rows.title,
                description : res.data.rows.description,
                skills : res.data.rows.skills_required,
                budget_range : res.data.rows.budget_range,
                status : res.data.rows.status

            })
        });
    }

	render(){
        if(window.sessionStorage.getItem("logged_in") === "true"){

            if(this.state.employer === window.sessionStorage.getItem("email")){
		return(
            <div className="limiter">
		       
            </div>
           
        )}else{
            window.location.href = "http://localhost:3000/projectaction"
        }
    } else{

        console.log("Hello")
        return(
            <AddBid/>
        )
    }}
}

export default ProjectAction;
