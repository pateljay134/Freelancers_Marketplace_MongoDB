import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import UserBiddedProjects from './userbiddedprojects';
import axios from 'axios';
// import HomePage from './homepage';
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';
//import { debug } from 'util';

class UserBids extends React.Component{
    constructor(props) {
        super(props);
        this.state = {projects : [],  current_page : 1, rows_per_page : 10, session_exist:null}
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleAllProject = this.handleAllProject.bind(this)
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
        axios.post('http://localhost:3001/userbids', profile)
        .then(res => {
            
            this.setState({
                projects : res.data.rows
            })
        });
        
    }
    handleChange(e){
        e.preventDefault();
        var search_data = {search_data : e.target.value, email : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/searchbiddedproject', search_data)
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
        axios.post('http://localhost:3001/biddingfilterstatus', search_data)
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
        axios.post('http://localhost:3001/userbids', profile)
        .then(res => {
            this.setState({
                projects : res.data.rows
            })
        });
        
    }
	render(){
            if(this.state.projects === null){
                <UserBiddedProjects/>
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
                <UserBiddedProjects project_name = {data.project_data.title} employer = {data.project_data.employer} status = {data.project_data.status} bid_id = {data.bid_id} project_id = {data.project_id} days = {data.days} usd = {data.usd} bidder_name = {data.bidder_name}/>
                )
            })
        }

        if(window.sessionStorage.getItem("logged_in")){
            return(
                <div className="table">
                    <input style={{width : "80%", marginLeft : 7, height:55, fontSize:25, borderColor : "black"}} class= "wrap-input100 m-b-5" type = "text" onChange= {this.handleChange} placeholder = "Search 🔍"/>
                    <div class="dropdown" style={{float : "right", marginRight : 55}}>
                            <button style={{width:155, marginLeft:30, marginBottom:7}} class="dropbtn">Project Status ▾</button>
                            <div class="dropdown-content">
                                <a href="/" onClick = {this.handleClick} data-value = "PENDING">PENDING</a>
                                <a href="/" onClick = {this.handleClick} data-value = "ON GOING">ON GOING</a>
                                <a href="/" onClick = {this.handleAllProject} data-value = {window.sessionStorage.getItem("email")}>ALL PROJECTS</a>
                            </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr >
                            {/* <th>Bid Id</th> */}
                            {/* <th>Project Id</th> */}
                            <th>Project Name</th>
                            <th>Employer</th>
                            <th>Days</th>
                            <th>USD/hour</th>
                            <th>Status</th>
                            <th>Average Bid</th>
                            {/* <th>Bidder_name</th> */}
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

export default UserBids;
