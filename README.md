#  Freelancers' Marketplace using Kafka and MongoDB
Creating the prototype of Freelancer web application ( freelancer.com ) to demonstrate the use of stateless RESTful web services along with distributed messaging system Kafka as a middleware and NoSQL database MongoDB along with Passport as a authentication service middleware and deployment on Amazon EC2 instance.

# Overview
Application is developed in three part
1. react-client
2. node-backend
3. kafka-backend

React-client consists of react components and calls node-backend API on any user action. Node-backend and kafka-backend use ‘correlation-id’ to remember to communication, work as request/response and scalability is achieved for multiple request handling.
Node-backend does the message producing part and kafka-backend deals with performing actual functionality involving MongoDB database.
In this application Passport JS node module is used as a authentication middleware with persistent session configuration which are stored in MongoDB. This provides horizontal scalability.

## User stories:

* A user can Sign Up, Sign In, Update profile information, and Logout from application, .
* An authenticated user can Post Project and get bids from other users.
* An authenticated user can view project lists with pagination, sort projects, search for project with project name or skills required, and also bid on projects posted.
* An authenticated user can Hire freelancer on the basis of bids received and can also change the freelancer for the project.
* An authenticated user can Check open projects and number of bids on projects posted by other users.
* An authenticated user can Check project completion date when freelancer is hired.
* An authenticated user can add money to wallet, withdraw money, and pay money to hired freelancer.
* An authenticated user can see transaction history of money in his account with the pie chart of total added and withdrawed money.

## System Design
> Applications uses a simple Client-Server architecture

* Client Side : ReactJS (HTML5 and Bootstrap)

* Server Side : NodeJS, ExpressJS

* Database :  MongoDB

## Built with the MERN stack 

|MongoDB|Express|React|NodeJS|
|--|--|--|--|
|[![mdb](https://github.com/mongodb-js/leaf/blob/master/dist/mongodb-leaf_256x256.png?raw=true)](https://www.mongodb.com/)|[![mdb](https://camo.githubusercontent.com/fc61dcbdb7a6e49d3adecc12194b24ab20dfa25b/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67)](http://expressjs.com/de/)|[![mdb](https://cdn.auth0.com/blog/react-js/react.png)](https://facebook.github.io/react/)|[![mdb](https://camo.githubusercontent.com/9c24355bb3afbff914503b663ade7beb341079fa/68747470733a2f2f6e6f64656a732e6f72672f7374617469632f696d616765732f6c6f676f2d6c696768742e737667)](https://nodejs.org/en/)|
|a free and open-source cross-platform document-oriented database program|Fast, unopinionated, minimalist web framework for node.|a JavaScript library for building user interfaces|a JavaScript runtime built on Chrome's V8 JavaScript engine|


## System Architecture
![Architecture](/architecture.png)


## Frameworks / Libraries

| **Name** | **Description** |**Used**|
|----------|-------|---|
|  [React](https://facebook.github.io/react/)  |   Fast, composable client-side components.    | Frontend |
|  [Redux](http://redux.js.org) |  Enforces unidirectional data flows and immutable, hot reloadable store. Supports time-travel debugging. | Frontend |
|  [React Router](https://github.com/reactjs/react-router) | A complete routing library for React | Frontend |  Compiles ES6 to ES5. Enjoy the new version of JavaScript today.     | Frontend |
| [React Google Charts](https://github.com/RakanNimer/react-google-charts) | A React Google Charts Wrapper | Frontend |
| [Axios](https://github.com/mzabriskie/axios) | Promise based HTTP client for the browser and node.js | Frontend |
| [MaterializeCSS](http://materializecss.com/) | A a CSS Framework based on material design. | Frontend |
| [Express](https://github.com/expressjs/express) | For creating the backend logic | Backend |
| [Mongoose](https://github.com/Automattic/mongoose) | To work faster with MongoDB | Backend |
| [Apache Kafka](https://kafka.apache.org/)| Messaging Service | Middleware |
| [Passport](http://passportjs.org/) | For simplified authentication in Node.js | Backend |


### Steps to run application:

* Download the kafka latest release and un-zip it.
* Go to kafka directory: cd kafka_2.11-1.1.0
* Start Zookeeper: bin/zookeeper-server-start.sh config/ zookeeper.properties
* Start Kafka :  bin/kafka-server-start.sh config/server.properties
* Create Topics : Lab2-Kagdi/kafka_topics
* Go to Path : \react_node_backend
* npm install
* npm run start-dev

> This will start ReactJS server on 3000 port and NodeJS server will start at 3001 port.

* Go to Path : \ kafka_backend
* npm install
* node server.js

> This will start kafka_backend server.

## 📝 Author

##### Jaykumar Patel <kbd> [Github](https://github.com/pateljay134) / [LinkedIn](https://www.linkedin.com/in/pateljay134) / [E-Mail](mailto:pateljay134@gmail.com)</kbd>
