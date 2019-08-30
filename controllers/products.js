'use strict';

const response = require('../response');
const connection = require('../connect');

//! sortBy || sort || limit || pagenation || seacrh
exports.allProducts = function(req, res) {
	const sortBy = req.query.sortBy || 'id';
	const sort = req.query.sort || 'ASC';
	const limit = req.query.limit || 5;
	const page = (req.query.page - 1) * limit || 0;
	const search = req.query.search;

	let query =
		'SELECT id, product_name, description, image, (select name from categories where products.id_category = categories.id) as category, quantity, date_added, date_updated from products ';
	if (search != null) {
		query += ' WHERE product_name like "%' + search + '%"';
	}
	query += ' ORDER BY ' + sortBy + ' ' + sort + ' limit ' + page + ', ' + limit;
	connection.query(query, function(err, results) {
		if (err) {
			console.log(err);
		} else {
			res.status(200).json({
				status: 200,
				error: false,
				message: 'Successfully',
				data: results
			});
		}
	});
};

//!GET ALL DATA PRODUCTS
exports.products = function(req, res) {
	connection.query('SELECT * FROM products', function(error, rows, fields) {
		if (error) {
			console.log(error);
		} else {
			response.ok(rows, res);
		}
	});
};

//!GET DATA PRODUCTS BY ID
exports.getId = function(req, res) {
	connection.query('SELECT * FROM `products` WHERE `id` = ?', req.params.id, function(err, results, fields) {
		if (err) {
			console.log(err);
		} else {
			if (results.length > 0) {
				res.status(200).json({
					status: 200,
					error: false,
					message: 'Successfully get data products by id!',
					data: results
				});
			} else {
				res.status(400).json({
					status: 400,
					error: true,
					message: 'No data found!'
				});
			}
		}
	});
};

//!INSERT DATA PRODUCTS
exports.add = function(req, res) {
	// const name = req.body.name ? req.body.name : 'no data' || ternary operator
	// const desc = req.body.desc ? req.body.desc : 'no data'
	// const price = req.body.price ? req.body.price : 'no data'
	const { product_name, description, image, id_category, quantity, date_added, date_updated } = req.body;

	connection.query(
		'INSERT INTO `products` (product_name, description, image, id_category, quantity, date_added, date_updated) values (?, ?, ?, ?, ?, ?, ?)',
		[ product_name, description, image, id_category, quantity, date_added, new Date() ],
		function(err, results) {
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
		}
	);
};

//!UPDATE DATA PRODUCTS
exports.update = function(req, res) {
	const { product_name, description, image, id_category, quantity, date_added, date_updated } = req.body;

	if (!product_name || !description || !image || !id_category || !quantity || !date_added) {
		res.status(300).json({
			status: 300,
			error: true,
			message:
				'product_name, description, image, id_category, quantity, date_added, date_updated needed for update!'
		});
	} else {
		connection.query(
			'UPDATE `products` SET product_name = ?, description = ?, image = ?, id_category = ?, quantity = ?, date_added = ?, date_updated = ? where id = ?',
			[ product_name, description, image, id_category, quantity, date_added, new Date(), req.params.id ],
			function(err, results) {
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
			}
		);
	}
};

//!DELETE DATA PRODUCTS
exports.destroy = function(req, res) {
	connection.query('DELETE from `products` WHERE `id` = ?', [ req.params.id ], function(err, results) {
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

//! ADD QUANTITY PRODUCTS
exports.addProducts = function(req, res) {
	let number = req.params.number;
	connection.query(
		'UPDATE products set quantity = quantity + ' + number + ' where id = ?',
		[ req.params.id ],
		function(err, results) {
			if (err) {
				console.log(err);
			} else {
				res.status(200).json({
					status: 200,
					error: false,
					message: 'Quantity successfully added ' + number + ' at : ' + req.params.id
				});
			}
		}
	);
};

//!REDUCE QUANTITY PRODUCTS
exports.reduceProducts = function(req, res) {
	let number = req.params.number;
	connection.query(
		'UPDATE products set quantity = GREATEST(quantity - ' + number + ' ,0) where id = ? and quantity >=' + number,
		[ req.params.id ],
		function(err, results) {
			if (err) {
				console.log(err);
			} else {
				if (results.affectedRows == 0) {
					res.status(400).json({
						status: 400,
						error: true,
						message: 'Cannot reduce ' + number + ', Number must be lower than quantity'
					});
				} else {
					res.status(200).json({
						status: 200,
						error: false,
						message: 'Quantity successfully reduced ' + number + ' at id products: ' + req.params.id
					});
				}
			}
		}
	);
};
