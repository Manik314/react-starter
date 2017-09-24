import React from 'react';
import ReactDOM from 'react-dom';
import '../assets/css/main.scss';

ReactDOM.render(
	<div className="hello">
	<p>Hello there12</p>
	<img src={require('../assets/images/emailer.png')} className="logo-img" alt="logo" />
	</div>, 
	document.getElementById('root')
	);
