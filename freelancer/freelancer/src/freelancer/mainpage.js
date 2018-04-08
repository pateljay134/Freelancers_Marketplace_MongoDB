import React from 'react';
import Header from './header';
import Footer from './footer';
import BodyData from './bodydata';
//import axios from 'axios';

class FreeLancer extends React.Component{

	render(){
		//const {value} =  this.state
		return(
				<div>
					<Header />
					<BodyData />
					<Footer />
				</div>
		)
  }
}
export default FreeLancer;