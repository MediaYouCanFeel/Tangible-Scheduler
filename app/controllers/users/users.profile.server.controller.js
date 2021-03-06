'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var curUser = req.user;
	var updUser = req.body;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete updUser.roles;

	if (curUser) {
		if(String(curUser._id) === String(updUser._id))
		{
			// Merge existing curUser
			delete updUser.isAdmin;
			curUser = _.extend(curUser, updUser);
			curUser.updated = Date.now();
			//curUser.displayName = curUser.firstName + ' ' + curUser.lastName;

			curUser.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					req.login(curUser, function(err) {
						if (err) {
							res.status(400).send(err);
						} else {
							res.jsonp(curUser);
						}
					});
				}
			});
		}
		else
		{
			if(curUser.isAdmin)
			{
				
				updUser.roles = (updUser.isAdmin) ? 'admin' : 'user';
				updUser.updated = Date.now();
				updUser = _.extend(curUser, updUser);
				updUser.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
					else
					{
						res.jsonp(updUser);
					}
				});
			}
			else
			{
				res.status(400).send({
					message: 'Non-admin attempted to update another User'
				});
			}
		}
	} else {
		res.status(400).send({
			message: 'curUser is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};
/**
 * List of Users
 */
exports.list = function(req, res) { User.find().sort('-created').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};

/*
 * Find user by skill
 */
exports.findBySkill = function(req, res) {
	User.find()
	.where('skills').equals(req.params.skillId)
	.sort('-created').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};
