'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please include an Event name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please include an Event description',
		trim: true
	},
	date: {
		type: Date,
		required: 'Please include Event date',
		trim: true
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	},
	skillsNeeded: [{
		skill: String,
		Isrequired: Boolean,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	}],
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Event', EventSchema);
console.log('Event collection created');
