import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import UserProjectsDisplay from './userprojectsdisplay';
import axios from 'axios';
// import HomePage from './homepage';
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';
//import { debug } from 'util';

class UserProjects extends React.Component{
    constructor(props) {
        super(props);
        this.state = {projects : [], statuspending : "PENDING", statusongoing: "ON GOING"}
        this.handleClick = this.handleClick.bind(this)
        this.handleAllProject = this.handleAllProject.bind(this)
    }

    componentWillMount() {
        debugger
        var profile = {email : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/userprojects', profile)
        .then(res => {
            debugger
            this.setState({
                projects : res.data.rows
            })
        });
        debugger
    }
    handleClick(e){
        e.preventDefault();
        debugger
        var search_data = {search_data : e.target.dataset.value, employer : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/filterstatus', search_data)
        .then(res => {
            console.log()
            this.setState({
                projects : res.data.rows
            })
        });
    }
    handleAllProject(e){
        e.preventDefault();
        var profile = {email : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/userprojects', profile)
        .then(res => {
            debugger
            this.setState({
                projects : res.data.rows
            })
        });
        debugger
    }

	render(){
        var project_list = this.state.projects.map( data => { 
            return(
            <UserProjectsDisplay project_id = {data.project_id}  title = {data.title} description = {data.description} skills_required = {data.skills_required} budget_range = {data.budget_range} total_bids = {data.total_bids} status = {data.status}/>
            )
        })

        if(window.sessionStorage.logged_in === "true"){
            return(
                <div className="table">
                
                    <table className="table">
                        <thead>
                            <tr >
                            {/* <th>Project Id</th> */}
                            <th>Project Name</th>
                            <th>Description</th>
                            <th>Skills Required</th>
                            <th>Budget Range($)</th>
                            <th>Number of Bids</th>
                            <th>Status</th>
                            <th>
                            <div class="dropdown" style={{paddingRight:4}}>
                            <button style={{width:155}} class="dropbtn">Project Status ▾</button>
                            <div class="dropdown-content">
                                <a href="/" onClick = {this.handleClick} data-value = "PENDING">PENDING</a>
                                <a href="/" onClick = {this.handleClick} data-value = "ON GOING">ON GOING</a>
                                <a href="/" onClick = {this.handleAllProject} data-value = {window.sessionStorage.getItem("email")}>ALL PROJECTS</a>
                            </div>
                            </div>
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {project_list}
                        </tbody>
                    </table>
                </div>
            )
        }
        else{
            return(
                window.location.href = "http://localhost:3000/SignIn"
            )
        }
    }
}

export default UserProjects;
