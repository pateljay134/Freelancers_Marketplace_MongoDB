import React from 'react';
// import { Z_FIXED } from 'zlib';
//import axios from 'axios';

class HomePage extends React.Component{
	render(){
		return(
            <div>
                <header className="masthead text-center text-white" >
                    <div className="masthead-content" >
                        <div className="container" >
                            <h6 className="display-2">Hire expert freelancers for any job, online</h6>
                            <h2 className="display-4">Millions of small businesses use Freelancer to turn their ideas into reality.</h2>
                            <a href="/" className="btn btn-primary btn-xl rounded-pill mt-5">Learn More</a>
                        </div>
                    </div>
                    <div className="bg-circle-1 bg-circle"></div>
                    <div className="bg-circle-2 bg-circle"></div>
                    <div className="bg-circle-3 bg-circle"></div>
                    <div className="bg-circle-4 bg-circle"></div>
                </header>
                
                <section>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 order-lg-2">
                                <div className="p-5">
                                    <img className="img-fluid rounded-circle" src={require("../img/f1.png")}  alt=""/>
                                </div>
                            </div>
                            <div className="col-lg-6 order-lg-1">
                                <div className="p-5">
                                    <h2 className="display-4">Need work done?</h2>
                                    <p>It's easy. Simply post a job you need completed and receive competitive bids from freelancers within minutes.</p>

                                    <p>Whatever your needs, there will be a freelancer to get it done: from web design, mobile app development, virtual assistants, product manufacturing, and graphic design (and a whole lot more).</p>

                                    <p>With secure payments and thousands of reviewed professional to choose from, Freelancer.com is the simplest and safest way to get work done online.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="p-5">
                                    <img className="img-fluid rounded-circle" src={require("../img/f2.jpg")} alt=""/>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="p-5">
                                    <h2 className="display-4">What’s great about it?</h2>
                                    <p>You only have to pay for work when it has been completed and you’re 100% satisfied.</p>
                                    <p>You’ll receive free bids from our talented freelancers within seconds.</p>
                                    <p>We’re always here to help. Our support consists of real people who are available 24/7.</p>
                                    <p>You can live chat with your freelancers to get constant updates on the progress of your work.</p>
                                    <p>Keep up-to-date and on-the-go with our time tracker, and mobile app.</p>
                                    <p>Find professionals you can trust by browsing their samples of previous work and reading their profile reviews.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 order-lg-2">
                                <div className="p-5">
                                    <img className="img-fluid rounded-circle" src={require("../img/f3.png")} alt=""/>
                                </div>
                            </div>
                            <div className="col-lg-6 order-lg-1">
                                <div className="p-5">
                                    <h2 className="display-4">What kind of work can I get done?</h2>
                                    <p>How does "anything you want" sound? We have experts representing every technical, professional and creative field.</p>
                                    <p>Just give us the details about the work you need completed, and our freelancers will get it done faster, better, and cheaper than you could possibly imagine. This includes:</p>
                                    <p>Small jobs, large jobs, anything in-between.</p>
                                    <p>Jobs that are on fixed price, or hourly terms.</p>
                                    <p>Work that requires specific skill sets, costs, or scheduling requirements.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <script src="vendor/jquery/jquery.min.js"></script>
                <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
            </div>
        )
    }
}

export default HomePage;