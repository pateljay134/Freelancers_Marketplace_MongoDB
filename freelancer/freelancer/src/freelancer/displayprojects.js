import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import axios from 'axios';
import './css/one-page-wonder.min.css';


class DisplayProjects extends React.Component{
    constructor(props) {
        super(props);
        this.state = {session_exist: null, average_days:null, total_bids : null, project_id : null, project_bids_id : null}
        this.handleClick = this.handleClick.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
        this.handleAdminLinkClick = this.handleAdminLinkClick.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
        this.countDays = this.countDays.bind(this);
        this.countTotalBids = this.countTotalBids.bind(this);
    }
    countDays(){
        
            var project_details = { project_id : this.props.project_id}
            axios.post('http://localhost:3001/projectfetch', project_details)
            .then(res => {
                if(typeof res.data.result !== "undefined" && typeof res.data.rows !== "undefined")
                this.setState({
                    average_days : res.data.result,
                    project_id : res.data.rows.project_id
                })
            });
    }
    countTotalBids(){
        
        var project_details = { project_id : this.props.project_id}
        axios.post('http://localhost:3001/projectbidcount', project_details)
        .then(res => {
            this.setState({
                total_bids : res.data.total_bids,
                project_bids_id : res.data.project_id
            })
        });
    }
    handleClick(e){
        e.preventDefault();
        window.sessionStorage.setItem("project_id",this.props.project_id );
        window.location.href = "http://localhost:3000/addbid"
    }
    
    handlePayment(e){
        e.preventDefault();
        window.sessionStorage.setItem("bidder_email", this.props.hired_bidder)
        window.sessionStorage.setItem("project_id", this.props.project_id)
        window.location.href = "http://localhost:3000/makepayment"
    }

    handleLinkClick(e){
        
        e.preventDefault();
        console.log(e.target.value)
            window.sessionStorage.setItem("project_id",this.props.project_id );
            window.location.href = "http://localhost:3000/addbid"
    }
    handleAdminLinkClick(e){
        e.preventDefault();
        console.log(e.target.value)
        window.sessionStorage.setItem("project_id",this.props.project_id );
        window.sessionStorage.setItem("isAdmin",true);
        window.location.href = "http://localhost:3000/addbid"
    }

	render(){
        if(window.location.href === "http://localhost:3000/adminaction"){
            if(this.props.status === "ON GOING"){
                this.countDays()
                return (
                    <tr >
                    <td ><a href="/" style={{color:"#29B3FE"}} value  = {this.props.project_id} onClick = {this.handleAdminLinkClick}>{this.props.title}</a></td>
                    <td >{this.props.description}</td>
                    <td >{this.props.skills_required}</td>
                    <td >${this.props.budget_range}</td>
                    <td>{this.props.hired_bidder}</td>
                    <td>{this.props.status}</td> 
                    <td>{this.state.average_days}</td>
                    <td>
                        <div class="col-md-6">
                            <button type="submit" class="btn btn-submit btn-block"style={{width : 150}} onClick = {this.handlePayment}>Make Payment</button>
                        </div>
                    </td>
                    </tr> 
                    )
            }else{
                this.countDays()
                return (
                    <tr >
                    <td ><a href="/" style={{color:"#29B3FE"}} value  = {this.props.project_id} onClick = {this.handleAdminLinkClick}>{this.props.title}</a></td>
                    <td >{this.props.description}</td>
                    <td >{this.props.skills_required}</td>
                    <td >${this.props.budget_range}</td>
                    <td>{this.props.hired_bidder}</td>
                    <td>{this.props.status}</td> 
                    <td>{this.state.average_days}</td>
                    </tr> 
                    )
            }
            
        }else{
            this.countDays()
            this.countTotalBids()
            return (
                <tr>
                <td ><a href="/" style={{color:"#29B3FE"}} value  = {this.props.project_id} onClick = {this.handleLinkClick}>{this.props.title}</a></td>
                <td >{this.props.description}</td>
                <td >{this.props.skills_required}</td>
                <td >{this.props.employer}</td>
                <td >${this.props.budget_range}</td>
                <td>{this.props.status}</td> 
                <td>{this.state.average_days}</td>
                <td>{this.state.total_bids}</td>
                <button className="login100-form-btn-bid" value  = {this.props.project_id} onClick = {this.handleClick}>Bid on Project</button>
                </tr> 
            )
        }
    }
}

export default DisplayProjects;
