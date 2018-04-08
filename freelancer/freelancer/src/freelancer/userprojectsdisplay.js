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


class UserProjectsDisplay extends React.Component{
    constructor(props) {
        super(props);
        // this.state = {bid_on_project : false}
        this.state = {total_bids : null}
        this.handleClick = this.handleClick.bind(this);
        this.handleAdminLinkClick = this.handleAdminLinkClick.bind(this);
        // this.handleCancel = this.handleCancel.bind(this);
    }

    handleClick(e){
        window.sessionStorage.setItem("project_id",this.props.project_id );
        window.location.href = "http://localhost:3000/adminaction"
    }
    handleAdminLinkClick(e){
        debugger
        window.sessionStorage.setItem("project_id",this.props.project_id );
        window.sessionStorage.setItem("isAdmin",true);
        window.sessionStorage.setItem("logged_in",true);
        window.location.href = "http://localhost:3000/addbid"
        // });
    }
    componentWillMount() {
        var project = {project_id : this.props.project_id}
        var self = this;
        axios.post('http://localhost:3001/projectbidcount', project)
        .then(res => {
            console.log(res.data)
            self.setState({
                total_bids : res.data.total_bids
            })
        });
    }

	render(){
        
        return (
            // this.state.bid_on_project ? passwordPage : displayprojects 
           <tr >
            {/* <td >{this.props.project_id}</td> */}
            <td ><a href="/AddBid" style={{color:"#29B3FE"}} value  = {this.props.project_id} onClick = {this.handleAdminLinkClick}>{this.props.title}</a></td>
            <td >{this.props.description}</td>
            <td >{this.props.skills_required}</td>
            {/* <td >{this.props.employer}</td> */}
            <td >$0 - {this.props.budget_range}</td> 
            <td >{this.state.total_bids}</td> 
            <td>{this.props.status}</td>
            <button className="login100-form-btn-bid" value  = {this.props.project_id} onClick = {this.handleClick}>View Bidders</button>
              
        </tr>
        )
    }
}

export default UserProjectsDisplay;
