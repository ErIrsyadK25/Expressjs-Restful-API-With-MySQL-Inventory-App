'use strict';

const response = require('../response');
const connection = require('../connect');

//!SELECT * FROM CATEGORIES
exports.index = function(req, res) {
	connection.query('SELECT * FROM categories', function(error, rows, fields) {
		if (error) {
			console.log(error);
		} else {
			response.ok(rows, res);
		}
	});
};

//!SELECT DATA BY ID
exports.getId = function(req, res) {
	connection.query('SELECT * FROM `categories` WHERE `id` = ?', req.params.id, function(err, results, fields) {
		if (err) {
			console.log(err);
		} else {
			if (results.length > 0) {
				res.status(200).json({
					status: 200,
					error: false,
					message: 'Successfully get single data!',
					data: results
				});
			} else {
				res.status(400).json({
					status: 400,
					error: true,
					message: 'No data found!',
					data: results
				});
			}
		}
	});
};

//!INSERT DATA
exports.add = function(req, res) {
	// const name = req.body.name ? req.body.name : 'no data' || ternary operator
	const { name } = req.body;

	connection.query('INSERT INTO `categories` (name) values (?)', [ name ], function(err, results) {
		if (err) {
			console.log(err);
			res.status(400).json({
				status: 400,
				message: 'Error add new data!'
			});
		} else {
			res.status(200).json({
				status: 200,
				error: false,
				message: 'Successfully add new data!',
				data: req.body
			});
		}
	});
};

//!UPDATE DATA CATEGORIES
exports.update = function(req, res) {
	const { name } = req.body;

	if (!name) {
		res.status(300).json({
			status: 300,
			error: true,
			message: 'name needed for update!'
		});
	} else {
		connection.query('UPDATE `categories` SET name = ? where id = ?', [ name, req.params.id ], function(
			err,
			results
		) {
			if (err) {
				console.log(err);
			} else {
				res.status(200).json({
					status: 200,
					error: false,
					message: 'Successfully update data with id: ' + req.params.id,
					data: req.body
				});
			}
		});
	}
};

//!DELETE DATA PRODUCTS
exports.destroy = function(req, res) {
	connection.query('DELETE from `categories` WHERE `id` = ?', [ req.params.id ], function(err, results) {
		if (err) {
			console.log(err);
		} else {
			if (results.affectedRows > 0) {
				res.status(200).json({
					status: 200,
					error: false,
					message: 'Successfully delete data with id: ' + req.params.id
				});
			} else {
				res.status(400).json({
					status: 400,
					error: true,
					message: 'Cannot delete data with id: ' + req.params.id
				});
			}
		}
	});
};
