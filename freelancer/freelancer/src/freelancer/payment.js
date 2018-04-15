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
import PieChart from 'react-simple-pie-chart';

class Payment extends React.Component{

    constructor(props) {
        super(props);
        this.state = {debit_amount:0, credit_amount : 0, session_exist:null, balance : null,card_number : null, expiry_date : null, cvv : null, name_on_card:null, amount:null, invalid:true, bank_account : null, routing_number : null}
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleNumberChange = this.handleNumberChange.bind(this)
        this.handleExpiryDate = this.handleExpiryDate.bind(this)
        this.handleCvv = this.handleCvv.bind(this)
        this.handleName = this.handleName.bind(this)
        this.handleAmount = this.handleAmount.bind(this)
        this.handleBankAccount = this.handleBankAccount.bind(this)
        this.handleWithdraw = this.handleWithdraw.bind(this)
        this.handleRoutingNumber = this.handleRoutingNumber.bind(this)
        this.handleDebitAmount = this.handleDebitAmount.bind(this)
    }
    componentWillMount(){
        var profile = {email : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/profilefetch',profile)
        .then(res => {
            this.setState({
                balance : res.data.rows.balance
            })
        });
        
        axios.post('http://localhost:3001/transactionhistory', profile)
        .then(res => {
            debugger
            res.data.rows.transaction_details.map( data => {
                    if(data.amount>0) {
                    this.state.credit_amount = this.state.credit_amount + Number(data.amount)
                    }
                    else{
                        this.state.debit_amount = this.state.debit_amount + Number(data.amount*-1)
                    }
                })
            })
    }
    handleNumberChange(e){
        debugger
        e.preventDefault();
        var visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
        var mastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
        var amex = /^3[47][0-9]{13}$/;
        var dinersclub = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
        var discover =  /^6(?:011|5[0-9]{2})[0-9]{12}$/;
        var jcb = /^(?:2131|1800|35\d{3})\d{11}$/;
        var card_number = e.target.value;
        debugger
        if (visa.test(card_number) || mastercard.test(card_number) || amex.test(card_number) || dinersclub.test(card_number) || discover.test(card_number) || jcb.test(card_number)){
            document.getElementById('card_number').innerHTML = ""
            this.setState({
                card_number : card_number,
                invalid : false
            })
        }else{
            document.getElementById('card_number').innerHTML = "Enter Valid Card Number"
            this.setState({
                card_number : null,
                invalid : true
            })
        }
    }
    handleExpiryDate(e){
        e.preventDefault();
        var date = /^[0][1-9][/][2-3][0-9]|[1][0-2][/][2-3][0-9]|[0][1-9][/][1][9]|[0][5-9][/][1][8]|[1][0-2][/][1][8-9]|[1][0-2][/][1][8-9]$/;
        if (!date.test(e.target.value)){
            document.getElementById('date').innerHTML = "Enter Valid Expiry Date"
            this.setState({
                expiry_date : null,
                invalid : true
            })
            
        }else{
            document.getElementById('date').innerHTML = ""
            this.setState({
                expiry_date : e.target.value,
                invalid : false
            })
        }
    }
    handleCvv(e){
        e.preventDefault();
        var cvv = /^[0-9][0-9][0-9]| [0-9][0-9][0-9][0-9]$/;
        if (!cvv.test(e.target.value)){
            document.getElementById('cvv').innerHTML = "Enter Valid CVV Number"
            this.setState({
                cvv : null,
                invalid : true
            })
           
        }else{
            document.getElementById('cvv').innerHTML = ""
            this.setState({
                cvv : e.target.value,
                invalid : false
            })
        }
    }
    handleName(e){
        e.preventDefault()
        this.setState({
            name_on_card : e.target.value,
            invalid : false

        })
    }
    handleAmount(e){
        e.preventDefault()
        this.setState({
            amount : e.target.value,
            invalid : false

        })
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
    handleSubmit(e){
        e.preventDefault();
        if(!this.state.invalid && (this.state.name_on_card!== null && this.state.cvv!== null && this.state.expiry_date!== null && this.state.amount!== null && this.state.card_number!== null)){
            document.getElementById('alert').innerHTML = ""
            document.getElementById('alert').className = ""
            var update_data = {email : window.sessionStorage.getItem("email"), name_on_card : this.state.name_on_card, card_number : this.state.card_number, amount : this.state.amount, expiry_date : this.state.expiry_date, cvv : this.state.cvv}

            axios.post('http://localhost:3001/balanceupdate',update_data)
            .then(res => {
                
                var data_inserted = res.data.data_inserted;
                if(data_inserted){
                    alert('update successful');
                    window.sessionStorage.setItem("bidder_email", window.sessionStorage.getItem("email"))
                    }
                    window.location.href = "http://localhost:3000/Profile"
                    // this.props.history.push('/Profile');
                }
            );
        }else{
            document.getElementById('alert').innerHTML = "ENTER VALID CARD DETAILS"
            document.getElementById('alert').className = "alert alert-danger"
        }
    }
    handleWithdraw(e){
        e.preventDefault();
        if(this.state.bank_account !== null || this.state.routing_number !== null || this.state.amount !== null){
            console.log("-"+this.state.amount)
            var update_data = {email : window.sessionStorage.getItem("email"), bank_account :this.state.bank_account , routing_number : this.state.routing_number, amount : "-"+this.state.amount }
        
            axios.post('http://localhost:3001/withdrawbalance',update_data)
            .then(res => {
                var data_inserted = res.data.data_inserted;
                if(data_inserted){
                    alert('update successful');
                    }
                    window.location.href = "http://localhost:3000/Profile"
                    // this.props.history.push('/Profile');
                }
            );
        }else{
            document.getElementById('alert').innerHTML = "ENTER VALID CARD DETAILS"
            document.getElementById('alert').className = "alert alert-danger"
        }
    }

    viewHistory(e){
        e.preventDefault();
        window.location.href = "http://localhost:3000/transactionhistory"
    }

	render(){

        
        debugger
        if(window.sessionStorage.getItem("logged_in")){
            return(
                <div>
                    <div  >
                        <div class="row login100-form-title p-b-51" style={{marginTop:80}}>
                            Balance
                        </div>
                        <div class="row login100-form-title p-b-51" >
                            $ {this.state.balance}
                        </div>
                    </div>
                    <div style={{float:"left", width:600}}>
                    <div class="container-credit_card" >
                    <div class="row">
                        <div class="col-md-80 offset-md-2">
                            <div class="card card-block">
                                <h3 class="text-xs-center">Add Money</h3>
                                <p id="alert" ></p>
                                <div style={{marginTop:50, marginBottom:10}}>
                                <img src={require("../images/visa.png")} style={{width: 60, height: 30}} alt = "Not Uploaded Yet"/>
                                <img src={require("../images/mc.png")} style={{width: 50, height: 30, marginLeft:4}} alt = "Not Uploaded Yet"/>
                                <img src={require("../images/diners.png")} style={{width: 100, height: 30, marginLeft:5}} alt = "Not Uploaded Yet"/>
                                <img src={require("../images/amex.png")} style={{width: 60, height: 30, marginLeft:5}} alt = "Not Uploaded Yet"/>
                                <img src={require("../images/discover.png")} style={{width: 115, height: 20, marginLeft:8}} alt = "Not Uploaded Yet"/>
                                <img src={require("../images/jcb.png")} style={{width: 60, height: 30, marginLeft:7}} alt = "Not Uploaded Yet"/>
                                </div>

                                <fieldset>
                                    <div class="form-group">
                                        {/* <label>Card Number</label> */}
                                        <input maxLength = "16" onChange = {this.handleNumberChange} placeholder= "1234 5678 0987 6543" type="text" class="form-control" autocomplete="off" pattern="\d{16}" title="Credit card number" required=""/>
                                        <p id="card_number" style={{color:'red', marginBottom:5}}></p>
                                    </div>
                                    <div class="form-group row">
                                        {/* <label class="col-md-12">Card Expiry Date</label> */}
                                        <div class="col-md-4">
                                            <input class="form-control" onChange = {this.handleExpiryDate} type="text" maxLength="5" placeholder="MM/YY"/>
                                            <p id="date" style={{color:'red', marginBottom:5}}></p>
                                            
                                        </div>
                                        <div class="col-md-4">
                                            <input type="text" onChange = {this.handleCvv} class="form-control" autocomplete="off" maxlength="4" pattern="\d{3}" title="Three digits at back of your card" required="" placeholder="CVC / CVV"/>
                                            <p id="cvv" style={{color:'red', marginBottom:5}}></p>
                                        </div>
                                        <div>
                                        <img src={require("../images/cvv1.png")} style={{width: 65, height: 40}} alt = "Not Uploaded Yet"/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        {/* <label for="cc_name">Card Holder's Name</label> */}
                                        <input onChange = {this.handleName} placeholder= "Card Holder Name" type="text" class="form-control" id="cc_name" pattern="\w+ \w+.*" title="First and last name" required="required"/>
                                        <p id="name" style={{color:'red', marginBottom:5}}></p>
                                    </div>

                                    <div class="form-inline">
                                        <div class="input-group">
                                        {/* <div class="input-group-addon">$ </div> */}
                                        <input type="number" onChange = {this.handleAmount} class="form-control" id="exampleInputAmount" placeholder="00.00"/>
                                        <p id="amount" style={{color:'red', marginBottom:5}}></p>
                                        <div class="input-group-addon">Dollars </div>
                                        {/* <div class="input-group-addon">.00</div> */}
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-md-6">
                                            <button type="button" class="btn btn-cancel btn-block">Cancel</button>
                                        </div>
                                        <div class="col-md-6">
                                            <button type="submit" class="btn btn-submit btn-block" onClick = {this.handleSubmit}>Submit</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-credit_card1">
                <div class="row">
                    <div class="col-md-80 offset-md-4">
                        <div class="card card-block">
                            <h3 class="text-xs-center">Withdraw Money</h3>
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
                                        <button type="submit" class="btn btn-submit btn-block" onClick = {this.handleWithdraw}>Submit</button>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                    <button className="btn btn-submit" style={{ marginTop:50, marginLeft:30}} onClick={this.viewHistory}>
                                View Transaction History
                    </button>                
            </div>
            <div style={{width:300, marginLeft : 578, marginTop : 30}}>
            <PieChart
                slices={[
                    {
                    color: '#0f0',
                    value: this.state.credit_amount,
                    },
                    {
                    color: '#f00',
                    value: this.state.debit_amount,
                    },
                ]}
            />
            </div>
        </div>
        )      
        } else{
            return(window.location.href = "http://localhost:3000")
        }
    }
}

export default Payment;
