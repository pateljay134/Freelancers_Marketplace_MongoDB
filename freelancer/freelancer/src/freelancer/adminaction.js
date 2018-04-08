import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import BiddersList from './bidderslist';
import DisplayProjects from './displayprojects';
import axios from 'axios';
// import HomePage from './homepage';
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';
//import { debug } from 'util';

class DashBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {bidders_list : [],hired_bidder :null,status:null,project_id : null, title : null, description : null, skills : null, budget_range : null, total_bids : null}
    }

    componentWillMount() {
        debugger
        var project_details = { project_id : window.sessionStorage.getItem("project_id")}
        // var bidder_details = { project_id : window.sessionStorage.getItem("project_id")}
        axios.post('http://localhost:3001/projectfetch',project_details)
        .then(res => {
            var project = res.data.rows
            this.setState({
                project_id : project.project_id,
                title : project.title,
                description : project.description,
                skills : project.skills_required,
                budget_range : project.budget_range,
                total_bids : project.total_bids,
                hired_bidder: project.hiredbidder,
                status  : project.status
            })
        });
        axios.post('http://localhost:3001/biddersfetch',project_details)
        .then(res => {
            this.setState({
                bidders_list : res.data.rows
            })
        });
    }

	render(){

        var project_list = <DisplayProjects project_id = {this.state.project_id}  title = {this.state.title} description = {this.state.description} skills_required = {this.state.skills} budget_range = {this.state.budget_range} total_bids = {this.state.total_bids} hired_bidder = {this.state.hired_bidder} status = {this.state.status}/>
        var bidderlist= this.state.bidders_list.map( data => { 
            return(
            <BiddersList bid_id = {data.bid_id}  days = {data.days} usd = {data.usd} bidder_name = {data.bidder_name}  bidder_email = {data.bidder_email} />
            )
        })

        if(window.sessionStorage.logged_in === "true"){
            return(
                <div className="table">
                    <table className="table">
                        <thead>
                            <tr >
                            <th>Project Name</th>
                            <th>Description</th>
                            <th>Skills Required</th>
                            <th>Budget Range</th>
                            <th>Hired Bidder</th>
                            <th>Project Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project_list}
                        </tbody>
                    </table>
                    <table className="table">
                        <thead>
                            <tr >
                            <th>Bidder Name</th>
                            <th>Days</th>
                            <th>USD/hour</th>
                            <th>Bidder Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bidderlist}
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
