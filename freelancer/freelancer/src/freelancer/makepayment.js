import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import axios from 'axios';
// import UserDetails from './userdetails';
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';
// import ProfileImage from './profileimage';
// import ProfileDetails from './profiledetails';
// import BidderProfileDetails from './bidderprofiledetails';
// import BidderProfileImage from './bidderprofileimage';
//import { debug } from 'util';

class MakePayment extends React.Component{

    constructor(props) {
        super(props);
        this.state = {card_number : null, expiry_date : null, cvv : null, name_on_card:null, amount:null, invalid:true, bank_account : null, routing_number : null}
        this.handleBankAccount = this.handleBankAccount.bind(this)
        this.handleTransfer = this.handleTransfer.bind(this)
        this.handleRoutingNumber = this.handleRoutingNumber.bind(this)
        this.handleDebitAmount = this.handleDebitAmount.bind(this)
    }
    handleBankAccount(e){
        e.preventDefault();
        this.setState({
            bank_account : e.target.value
        })
    }
    handleRoutingNumber(e){
        e.preventDefault();
        this.setState({
            routing_number : e.target.value
        })
    }
    handleDebitAmount(e){
        e.preventDefault();
        this.setState({
            amount : e.target.value
        })
    }
    handleTransfer(e){
        e.preventDefault();
        if(this.state.bank_account !== null && this.state.routing_number !== null && this.state.amount !== null){
            var update_data = {project_id : window.sessionStorage.getItem("project_id"), email : window.sessionStorage.getItem("email"),bidder_email :  window.sessionStorage.getItem("bidder_email"), bank_account :this.state.bank_account , routing_number : this.state.routing_number, amount : this.state.amount }
        
            axios.post('http://localhost:3001/transfermoney',update_data)
            .then(res => {
                var data_inserted = res.data.data_inserted;

                if(data_inserted){
                    alert('update successful');
                    }
                    window.location.href = "http://localhost:3000/workspot"
                    // this.props.history.push('/Profile');
                }
            );
        }else{
            document.getElementById('alert').innerHTML = "ENTER VALID CARD DETAILS"
            document.getElementById('alert').className = "alert alert-danger"
        }
    }


	render(){
        if(window.sessionStorage.getItem("logged_in")){
            return(
            <div class="container-credit_card1">
                <div class="row">
                    <div class="col-md-80 offset-md-4">
                        <div class="card card-block">
                            <h3 class="text-xs-center">Make Payment to {window.sessionStorage.getItem("bidder_email")}</h3>
                            <p id="alert" ></p>
                            <fieldset>
                                <div class="form-group">
                                    <input maxLength = "16" onChange = {this.handleBankAccount} placeholder= "Bank Account Number" type="text" class="form-control" autocomplete="off" pattern="\d{16}" title="Credit card number" required=""/>
                                    {/* <p id="card_number" style={{color:'red', marginBottom:5}}></p> */}
                                </div>
                                <div class="form-group">
                                    <input maxLength = "16" onChange = {this.handleRoutingNumber} placeholder= "Routing Number" type="text" class="form-control" autocomplete="off" pattern="\d{16}" title="Credit card number" required=""/>
                                    {/* <p id="card_number" style={{color:'red', marginBottom:5}}></p> */}
                                </div>
                                <div class="form-inline">
                                    <div class="input-group">
                                    <input type="number" onChange = {this.handleDebitAmount} class="form-control" id="exampleInputAmount" placeholder="00.00"/>
                                    {/* <p id="amount" style={{color:'red', marginBottom:5}}></p> */}
                                    <div class="input-group-addon">Dollars </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-6">
                                        <button type="button" class="btn btn-cancel btn-block">Cancel</button>
                                    </div>
                                    <div class="col-md-6">
                                        <button type="submit" class="btn btn-submit btn-block" onClick = {this.handleTransfer}>Submit</button>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
            )   
        } else{
            return(window.location.href = "http://localhost:3000")
        }
    }
}

export default MakePayment;
