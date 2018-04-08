import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import DisplayProjects from './displayprojects';
import axios from 'axios';
import './css/one-page-wonder.min.css';
// import { relative } from 'path';

class DashBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {projects : [],average_days:[]}
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        axios.post('http://localhost:3001/projectsfetch')
        .then(res => {
            console.log(res.data)
            this.setState({
                projects : res.data.rows
            })
        });
        debugger
    }

    handleChange(e){
        e.preventDefault();
        var search_data = {search_data : e.target.value, email : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/searchprojects', search_data)
        .then(res => {
            this.setState({
                projects : res.data.rows
            })
        });
    }

	render(){
        if(this.state.projects === null){
            <DisplayProjects/>
        }else{
        var project_list = this.state.projects.map( data => { 
            // if(data.status==="PENDING"){
                return(
                    
                <DisplayProjects project_id = {data.project_id}  title = {data.title} description = {data.description} skills_required = {data.skills_required} employer = {data.employer} budget_range = {data.budget_range} status = {data.status}/>

                )
            // }
        })
    }


        if(window.sessionStorage.logged_in === "true"){
            
            return(
                <div className="table">
                {/* <div>
                <button className="login100-form-btn-bid" style={{width:"50%", alignItems:"center"}}>All Projects</button>
                <button className="login100-form-btn-bid" style={{width:"50%"}}>Match The Skills</button>
                </div> */}
                    
                <input style={{width : "85%", height:55, fontSize:25, borderColor : "black"}} class= "wrap-input100 m-b-5" type = "text" onChange= {this.handleChange} placeholder = "Search 🔍"/>
                {/* <div class="dropdown" style={{float:"right", paddingBottom:5, paddingRight:4}}> */}
                <button style={{width:170, marginBottom:5, float:"right", marginRight:9}} class="dropbtn">Match Your Skills</button>
                {/* <div class="dropdown-content">
                    <a href="#">PENDING</a>
                    <a href="#">ON GOING</a>
                </div> */}
                {/* </div> */}
                    <table className="table">
                        <thead>
                            <tr >
                            {/* <th>Project Id</th> */}
                            <th>Project Name</th>
                            <th>Description</th>
                            <th>Skills Required</th>
                            <th>Employer</th>
                            <th>Budget Range</th>
                            <th>Project Status</th>
                            <th>Average Days</th>

                            <th>Total Bids</th>
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

export default DashBoard;
