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

class AssignProject extends React.Component{
    constructor(props) {
        super(props);
        this.state = {projects : []}
    }

    componentWillMount() {
        debugger
        var profile = {username : window.sessionStorage.getItem("username")}
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
            <UserProjectsDisplay project_id = {data.project_id}  title = {data.title} description = {data.description} skills_required = {data.skills_required} budget_range = {data.budget_range} total_bids = {data.total_bids}/>
            )
        })

        if(window.sessionStorage.logged_in === "true"){
            return(
                <div className="table">
                
                    <table className="table">
                        <thead>
                            <tr >
                            <th>Project Id</th>
                            <th>Project Name</th>
                            <th>Description</th>
                            <th>Skills Required</th>
                            <th>Budget Range($)</th>
                            <th>Number of Bids</th>
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

export default AssignProject;
