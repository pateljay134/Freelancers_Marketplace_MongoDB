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
        this.state = {session_exist:null, projects : [], statuspending : "PENDING", statusongoing: "ON GOING", current_page : 1, rows_per_page : 10}
        this.handleClick = this.handleClick.bind(this)
        this.handleAllProject = this.handleAllProject.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
    }

    componentWillMount() {
        
        axios.get('http://localhost:3001/checksession',{ withCredentials: true } )
        .then(res => {
            if(res.data.session_exist){
                debugger
                this.setState({
                    session_exist : res.data.session_exist
                })
            }
        });

        var profile = {email : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/userprojects', profile)
        .then(res => {
            
            this.setState({
                projects : res.data.rows
            })
        });
        
    }
    handlePageChange(e){
        e.preventDefault();
        this.setState({
            current_page : e.target.dataset.id
        })
    }
    handleClick(e){
        e.preventDefault();
        
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
            this.setState({
                projects : res.data.rows
            })
        });
        
    }
    handleChange(e){
        e.preventDefault();
        var search_data = {search_data : e.target.value, email : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/searchuserprojects', search_data)
        .then(res => {
            this.setState({
                projects : res.data.rows
            })
        });
    }
	render(){
            if(this.state.projects === null){
                <UserProjectsDisplay/>
            }else{
                console.log(this.state.projects)
                const lastIndex = this.state.current_page * this.state.rows_per_page;
                const firstIndex = lastIndex - this.state.rows_per_page;
                const projects_to_show = this.state.projects.slice(firstIndex, lastIndex);
                // const total_pages = this.state.projects.length > 0 ? this.state.projects.length/this.state.rows_per_page : 0;
                const page_numbers = [];
                for (let i = 1; i <= Math.ceil(this.state.projects.length / this.state.rows_per_page); i++) {
                    page_numbers.push(i);
                }  
                var pagination = page_numbers.map(number => {
                    return (
                        <div style={{float : "left"}}><li class="pagination pagination-lg" key= {number} data-id={number} onClick={this.handlePageChange} ><a data-id={number} class="page-link" href="/">{number}</a></li></div>
                    );
                });
                var project_list = projects_to_show.map( data => { 
                
                return(
                <UserProjectsDisplay project_id = {data.project_id}  title = {data.title} description = {data.description} skills_required = {data.skills_required} budget_range = {data.budget_range} total_bids = {data.total_bids} status = {data.status}/>
                )
            })
        }
        if(window.sessionStorage.getItem("logged_in")){
            return(
                <div className="table">
                    <input style={{width : "99%", marginLeft : 7, height:55, fontSize:25, borderColor : "black"}} class= "wrap-input100 m-b-5" type = "text" onChange= {this.handleChange} placeholder = "Search 🔍"/>
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
                    <div style={{float : "right", marginRight: 30}}>{pagination}</div>
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
