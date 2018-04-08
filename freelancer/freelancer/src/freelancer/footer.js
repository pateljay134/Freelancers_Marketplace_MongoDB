import React from 'react';
import './css/bootstrap.min.css';
// import 'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900';
// import 'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i';
import './css/one-page-wonder.min.css';

class Footer extends React.Component{
	render(){
		return(
			<footer className="py-5 bg-black" >
            <div className="container">
              <p className="m-0 text-center text-white small"><a href="/"><img src={require("../images/freelancerwhite.png")} style={{height:25}} alt="Freelancer"/></a>Copyright &copy; CMPE 273 Spring 2018</p>
            </div>
      </footer>
		)
	}
}



export default Footer; 
