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
        this.state = {projects : []}
    }

    componentWillMount() {
        debugger
        var profile = {email : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/userbids', profile)
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
            <UserBiddedProjects project_name = {data.project_data.title} employer = {data.project_data.employer} status = {data.project_data.status} bid_id = {data.bid_id} project_id = {data.project_id} days = {data.days} usd = {data.usd} bidder_name = {data.bidder_name}/>
            )
        })

        if(window.sessionStorage.logged_in === "true"){
            return(
                <div className="table">
                
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
