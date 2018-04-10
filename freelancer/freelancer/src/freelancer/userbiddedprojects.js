import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
// import DisplayProjects from './displayprojects';
import axios from 'axios';
// import HomePage from './homepage';
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';
// import AddBid from './addbid';
// import { debug } from 'util';


class UserBiddedProjects extends React.Component{
    constructor(props) {
        super(props);
        this.state = {average_days:null}
        this.handleLinkClick = this.handleLinkClick.bind(this)
    }
    componentDidMount() {
        if(this.props.project_id !== null){
        var project_details = { project_id : this.props.project_id}
        axios.post('http://localhost:3001/projectfetch', project_details)
        .then(res => {
            this.setState({
                average_days : res.data.result
            })
        });
        }
    }
    handleLinkClick(e){
        
        e.preventDefault();
        window.sessionStorage.setItem("project_id",this.props.project_id);
        window.sessionStorage.setItem("logged_in",true);
        window.location.href = "http://localhost:3000/addbid"
        // });
    }
	render(){
        
        return (
            // this.state.bid_on_project ? passwordPage : displayprojects 
           <tr >
            {/* <td >{this.props.bid_id}</td> */}
            <td ><a href="/AddBid" style={{color:"#29B3FE"}} value  = {this.props.project_id} onClick = {this.handleLinkClick}>{this.props.project_name}</a></td>
            {/* <td >{this.props.project_id}</td> */}
            <td >{this.props.employer}</td>
            <td >{this.props.days}</td>
            <td >{this.props.usd}</td>
            {/* <td >{this.props.employer}</td> */}
            <td >{this.props.status}</td> 
            <td >{this.state.average_days}</td> 
            {/* <button className="login100-form-btn-bid" value  = {this.props.project_id} onClick = {this.handleClick}>View Bidders</button> */}
              
        </tr>
        )
    }
}

export default UserBiddedProjects;
