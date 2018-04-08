import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import FreeLancer from './freelancer/mainpage';

ReactDOM.render(<FreeLancer />, document.getElementById('root'));
registerServiceWorker();
