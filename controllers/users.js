'use strict';
require('dotenv').config();

const connection = require('../connect');
/* This function saves a user to the db
	It uses promises.
 */
const jwt = require('jsonwebtoken');

//!LOGIN USERS
exports.login = (req, res) => {
	const email = req.body.email;
	connection.query('SELECT * FROM users where email = ?', email, function(err, results) {
		if (err) throw err;
		var user = {
			id: results[0]['id'],
			name: results[0]['full_name'],
			email: results[0]['email']
		};
		jwt.sign({ user: user }, process.env.SECRET_KEY, (err, token) => {
			res.json({
				token: token
			});
		});
	});
};

// exports.post = (req, res) => {
// 	jwt.verify(req.token, 'secretkey', (err, authData) => {
// 		if (err) {
// 			res.sendStatus(403);
// 		} else {
// 			res.json({
// 				message: 'Post created...',
// 				authData
// 			});
// 		}
// 	});
// };
//!REGISTER USER
exports.register = (req, res) => {
	// Mock user
	const { full_name, email, password } = req.body;
	connection.query(
		'INSERT into users (full_name, email, password) values (?, ?, ?)',
		[ full_name, email, password ],
		function(err) {
			if (err) {
				console.log(err);
				res.status(400).json({
					status: 400,
					message: 'Error Create New Users'
				});
			} else {
				res.status(200).json({
					status: 200,
					message: 'Succesfully Create New Users',
					data: {
						full_name: req.body.full_name,
						email: req.body.email
					}
				});
			}
		}
	);
};

/* When the user from the front-end wants to use a function,
 The below code is an example of using the word authenticate to see if the
 user is actually authenticated
*/
// exports.getUser = (req, res) => {
// 	res.send(req.user);
// };

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

//! Verify Token
exports.verifyToken = function verifyToken(req, res, next) {
	//! Get auth header value
	const bearerToken = req.headers.auth;

	//! Check if bearer is undefined
	if (typeof bearerToken !== 'undefined') {
		req.token = bearerToken;
		//! Next middleware
		jwt.verify(req.token, process.env.SECRET_KEY, (err) => {
			if (err) {
				res.send('Access denied!!');
			} else {
				console.log('Succesfully!');
				next();
			}
		});
	} else {
		//! Forbidden
		res.send('Please login to access app!!');
	}
};
