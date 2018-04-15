import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import SignIn from './signin';
import SignUp from './signup';
import HomePage from './homepage';
import AddProject from './addproject';
import Profile from './profile';
import Dashboard from './dashboard';
import AddBid from './addbid';
import WorkSpot from './workspot';
import AdminAction from './adminaction';
import Payment from './payment';
import MakePayment from './makepayment';
import TransactionHistory from './transactionhistory';

class BodyData extends React.Component{

	render(){
		return(
			
			// <Provider store = {store}>
			// {/* <Layout> */}
			<Router>
				<div>
					<Switch>
					<Route exact path="/" component={HomePage} />
					<Route path="/SignUp" component={SignUp} />
					<Route path="/SignIn" component={SignIn} />
					{/* <Route path="/SignIn" component={SignIn} store = {store} /> */}
					<Route path="/AddProject" component={AddProject} />
					<Route path="/Profile" component={Profile} />
					{/* <Route path="/Profile" component={Profile} store = {store}/>  */}
					<Route path="/Dashboard" component={Dashboard} /> 
					<Route path="/addbid" component={AddBid} /> 
					<Route path="/workspot" component={WorkSpot} /> 
					<Route path="/adminaction" component={AdminAction} /> 
					<Route path="/payment" component={Payment} /> 
					<Route path="/MakePayment" component={MakePayment} /> 
					<Route exact path="/TransactionHistory" component={TransactionHistory} />
					</Switch>
				</div>
			</Router>
			// {/* </Layout> */}
			// </Provider>
		)
	}
}

  export default BodyData; 