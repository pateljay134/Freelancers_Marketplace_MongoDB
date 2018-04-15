import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import axios from 'axios';
import './css/one-page-wonder.min.css';
import CreditHistory from './credithistory';

class TransactionHistory extends React.Component{
    constructor(props) {
        super(props);
        this.state = {transaction : null, credit_list:null , credit_amount:0, debit_amount : 0}
        var self = this
    }
    componentWillMount(){
        var payment_history = { email : window.sessionStorage.getItem("email")}
        axios.post('http://localhost:3001/transactionhistory', payment_history)
        .then(res => {
            console.log(this.state)
            this.setState({
                transaction : res.data.rows.transaction_details,
                credit_list : res.data.rows.transaction_details.map( data => {
                    return(
                        <CreditHistory name = {data.name_on_card} bank_card_number = {typeof data.bank_account!=="undefined" ? data.bank_account : data.card_number} amount = {data.amount}/>
                    )
                })
            })
            // this.state.credit_list = this.state.transaction.map( data => {
            //     return(
            //         <CreditHistory bank_card_number = {typeof data.bank_account!=="undefined" ? data.bank_account : data.card_number} amount = {data.amount}/>
            //     )
            // })
        });
    }
    
	render(){
        console.log(this.state.credit_list)
        debugger
        console.log(this.state.credit_amount)
        if(window.sessionStorage.getItem("logged_in")){

        return(
            <div style={{marginTop : 80}}>
                <p style={{marginLeft : 10, fontSize:30}}>Transaction History</p>
                
                <table className="table">
                        <thead>
                            <tr >
                            <th>Card/ Account Number</th>
                            <th>Amount</th>
                            <th>Debited / Credited</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.credit_list}
                        </tbody>
                </table>
                {/* <p>Debited Amount</p>
                <table className="table">
                        <thead>
                            <tr >
                            <th>Receiver's Account Number</th>
                            <th>Routing Number</th>
                            <th>Amount</th>
                            <th>Employer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {debit_list}
                        </tbody>
                </table> */}
            </div>
        ) 
    }}
}

export default TransactionHistory;
