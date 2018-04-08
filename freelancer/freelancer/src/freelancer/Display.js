import React from 'react';
import './calc.css';

class Display extends React.Component{
	render(){
		return(
			<input type = "text" className='display' readOnly value = {this.props.textBoxValue} />
		)
	}
}

export default Display; 