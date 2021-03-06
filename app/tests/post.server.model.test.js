'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Post = mongoose.model('Post'),
	Skillset = mongoose.model('Skillset');

/**
 * Globals
 */
var user, post;

/**
 * Unit tests
 */
describe('Post Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			post = new Post({
				name: 'Post Name',
				content: 'This is test Content',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return post.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			post.name = '';

			return post.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should show an error when try to save without content', function(done) { 
			post.content = '';

			return post.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to add created time for a skillset', function(done) { 
			post.created = Date.now();

			return post.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add a skill to a post', function(done) {
			post.skills = new Skillset({
				skill: 'Skillset Name',
				user: user
			});
			return post.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add a user to a post', function(done) {
			post.skill = user;
			return post.save(function(err) {
				should.not.exist(err);
				done();
			});
		});


		it('should be able to save without a post', function(done) { 
			post.skill = '';

			return post.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add a skill to post', function(done) { 
			post.skill = 'Camera man';

			return post.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to add multiple skills to post', function(done) { 
			post.skill = ['Camera man', 'Actor'];
			//post.skill = 'Actor';

			return post.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

	});

	describe('Method Update', function() {
		it('should be able to update without problems', function(done) {
			return post.update(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	describe('Method Remove', function() {
		it('should be able to remove without problems', function(done) {
			return post.remove(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	describe('Method Find', function() {
		it('should be able to find posts without problems', function(done) {
			return Post.find(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});


	afterEach(function(done) { 
		Post.remove().exec();
		User.remove().exec();

		done();
	});
});
