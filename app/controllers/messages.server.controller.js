'use strict';

/**
 * Module dependencies.
 */
var nodemailer = require('nodemailer');
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Message = mongoose.model('Message'),
	_ = require('lodash');

/**
 * Create a Message
 */
exports.create = function(req, res) {
	var message = new Message(req.body);
	message.user = req.user;

	message.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(message);
		}
	});
};

/**
 * Show the current Message
 */
exports.read = function(req, res) {
	res.jsonp(req.message);
};

/**
 * Update a Message
 */
exports.update = function(req, res) {
	var message = req.message ;

	message = _.extend(message , req.body);

	message.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(message);
		}
	});
};

/**
 * Delete an Message
 */
exports.delete = function(req, res) {
	var message = req.message ;

	message.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(message);
		}
	});
};

/**
 * List of Messages
 */
exports.list = function(req, res) { Message.find().sort('-created').populate('to'),populate('from').exec(function(err, messages) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messages);
		}
	});
};

/**
 * Message middleware
 */
exports.messageByID = function(req, res, next, id) { Message.findById(id).populate('to').populate('from').exec(function(err, message) {
		if (err) return next(err);
		if (! message) return next(new Error('Failed to load Message ' + id));
		req.message = message ;
		next();
	});
};

exports.sendMessage = function(req, res, next, id) {

	/* The following code was used to test the emailing function. The transporter object
	 * creates an SMTP connection everytime a message is sent using the gmail account
	 * credentials within the object passed into createTransport(). Just replace the
	 * fake info with a correct account to test. NODE THAT YOU MIGHT NEED TO DISABLE
	 * ANTIVIRUS SOFTWARE FOR IT TO WORK
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'user@gmail.com',
			pass: 'password'
		}
	});

	var mailOptions = {
		from: 'juandis007@gmail.com',
		to: 'juandis_007@hotmail.com',
		subject: 'ttest2',
		text: 'YOOOOOOO'
	};

	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			console.log(err);
		}
		else {
			console.log('Message send: ' + info.response);
			transporter.close();
		}
	});
	*/

	Message.findById(id).populate('to').populate('from').exec(function(err, message) {
		if (err) return next(err);

		var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: message.from.email,
				pass: message.from.emailPassword
			}
		});

		var mailOptions = {
			from: message.from.email,
			to: message.to.email,
			subject: message.subject,
			text: message.text
		};

		transporter.sendMail(mailOptions, function(err, info) {
			if (err) {
				console.log(err);
			}
			else {
				console.log('Message send: ' + info.response);
				transporter.close();
			}
		});
	});

	
}

/**
 * Message authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.message.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};