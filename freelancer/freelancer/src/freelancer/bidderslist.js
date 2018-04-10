import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import './css/one-page-wonder.min.css';
import axios from 'axios';

class DisplayProjectDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state = {profile_image : null}
        this.handleClick = this.handleClick.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
    }
    componentWillMount(){
        var project_details = {email : this.props.bidder_email}
        axios.post('http://localhost:3001/profilefetch',project_details)
        .then(res => {
            this.setState({
                profile_image : res.data.rows.profile_image
            })
        });
    }
    handleLinkClick(e){
        e.preventDefault();
            window.sessionStorage.setItem("bidderprofileemail", this.props.bidder_email)
            window.sessionStorage.setItem("bidderprofile", true)
            window.location.href = "http://localhost:3000/Profile"
    }
    handleClick(e){
        var bidder_name = {bidder_email : e.target.value, bidder_name : this.props.bidder_name, project_id : window.sessionStorage.getItem("project_id")}
        axios.post('http://localhost:3001/hirebidder',bidder_name)
        .then(res => {
            if(res.data.bidder_hired) window.location.href = "http://localhost:3000/adminaction"
            else{
                alert("You already hired a bidder for your project");
            }
        });
    }
	render(){
        return (
            <tr >
            <td ><img  src = {(this.state.profile_image) === null ? require("../images/avatar.gif") : require("../images/" + this.state.profile_image)}   style={{width: 80, height: 80}} alt = "Not Uploaded Yet"/></td>
            <td style={{paddingTop:40}}><a href="/" style={{color:'#29B3FE'}} onClick = {this.handleLinkClick}>{this.props.bidder_name}</a></td>
            <td style={{paddingTop:40}}>{this.props.days}</td>
            <td style={{paddingTop:40}}>{this.props.usd}</td>
            <td style={{paddingTop:40}}>{this.props.bidder_email}</td>
            <button className="login100-form-btn-bid hiring-button" value  = {this.props.bidder_email} onClick = {this.handleClick}>Hire Bidder</button> 
            </tr>
        )
    }
}

export default DisplayProjectDetails;
