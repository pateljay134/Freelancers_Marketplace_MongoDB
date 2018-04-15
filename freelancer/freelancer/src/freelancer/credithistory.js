import React from 'react';


class CreditHistory extends React.Component{
    constructor(props) {
        super(props);
    }
	render(){
        return(
                <tr>
                <td >{this.props.bank_card_number}</td>
                <td>{this.props.amount<0 ? Number(this.props.amount)*-1 : this.props.amount}</td>
                <td>{this.props.amount<0 ? "Debited" : ( "Credited by " + this.props.name )} </td>
                </tr> 
            )
    }
}

export default CreditHistory;
