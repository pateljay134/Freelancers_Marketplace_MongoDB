import React from 'react';
import HomePage from './homepage';
import axios from 'axios';

class FrontPage extends React.Component{
    constructor(props){
		super(props)
		this.state = {
            PATH : ''
        }
  }

	render(){
		//const {value} =  this.state
		return(
            <div>
                <HomePage />
            </div>
        )
    }
}

export default FrontPage;