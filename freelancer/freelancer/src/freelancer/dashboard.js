import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import DisplayProjects from './displayprojects';
import axios from 'axios';
import './css/one-page-wonder.min.css';
 
// import 'node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
// import { relative } from 'path';

class DashBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {session_exist : null, sort : 1, projects : [],average_days:null, project_id : null, total_bids : null, current_page : 1, rows_per_page : 10}
        this.handleChange = this.handleChange.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleSort = this.handleSort.bind(this)
    }

    componentWillMount() {

        axios.get('http://localhost:3001/checksession',{ withCredentials: true } )
        .then(res => {
            if(res.data.session_exist){
                this.setState({
                    session_exist : res.data.session_exist
                })
            }
            else{
                window.location.href = "http://localhost:3000";
            }
        });

        var sort = {sort : 1}
        console.log(1)
        axios.post('http://localhost:3001/projectsfetch', sort)
        .then(res => {
            console.log(res.data)
            this.setState({
                projects : res.data.rows
            })
        });

    }
    handleSort(e){
        e.preventDefault();
        debugger
        if(this.state.sort === 1){
            this.setState({
                sort : -1
            })
        }else{
            this.setState({
                sort : 1
            })
        }
        
        debugger
        var sort = {sort : this.state.sort}
        console.log(sort)
        axios.post('http://localhost:3001/projectsfetch', sort)
        .then(res => {
            console.log(res.data)
            this.setState({
                projects : res.data.rows
            })
        });
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
    
    handlePageChange(e){
        e.preventDefault();
        this.setState({
            current_page : e.target.dataset.id
        })
    }
	render(){
        if(this.state.projects === null){
            <DisplayProjects/>
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
                // this.countDays(data.project_id)
                // this.countTotalBids(data.project_id)
                // if(data.status=== "PENDING" || data.status=== "ON GOING"){
                    return(
                        
                    <DisplayProjects project_id = {data.project_id}  title = {data.title} description = {data.description} skills_required = {data.skills_required} employer = {data.employer} budget_range = {data.budget_range} status = {data.status}/>

                    )
                // }
            })
        }


        if(1===1){
            
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
                            <th style= {{width : 95}}><a class = "rangesort" href="/" onClick = {this.handleSort}>Budget Range ⇅</a></th>
                            <th>Project Status</th>
                            <th>Average Days</th>

                            <th>Total Bids</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project_list}
                        </tbody>
                    </table>

                    
                    <center style={{float : "right", marginRight: 30}}>{pagination}</center>
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
