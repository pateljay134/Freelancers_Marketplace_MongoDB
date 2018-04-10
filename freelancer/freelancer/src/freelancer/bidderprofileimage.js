import React from 'react';
import './css/freelancer.css';
import './css/bootstrap.min.css';
import './css/main.css';
import './css/util.css';
import axios from 'axios';
class BidderProfileImage extends React.Component{
	constructor(props) {
        super(props);
        this.state = { image_name : null };
    }
    componentWillMount() {
        var profile = {email : window.sessionStorage.getItem("bidderprofileemail")}
        window.sessionStorage.setItem("bidderprofile",false)
        axios.post('http://localhost:3001/profilefetch', profile)
        .then(res => {
            
            console.log(res.data.rows)
                this.setState({
                    image_name : res.data.rows.profile_image
                })
        });
        
    }

	render(){
        if(this.state.image_name === null){
            
            return(
                <div>
                    <img src={require("../images/avatar.gif")} style={{width: 100, height: 120, marginLeft:145}} alt = "Not Uploaded Yet"/>
                </div>
            )
        }
        else{
            return(
                <div>
                    <img src={require("../images/"+this.state.image_name)} style={{width: 100, height: 120, marginLeft:145}} alt = "Not Uploaded Yet"/>
                </div>
            )
        }
		
	}
}

export default BidderProfileImage; 