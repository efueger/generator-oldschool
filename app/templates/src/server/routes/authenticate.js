(function () {
	'use strict';

	const joi = require ('joi'),
		crypto = require ('crypto'),
		jwt = require ('jsonwebtoken'),
		config = require ('config'),
		boom = require ('boom');

	module.exports = [{
		method: 'POST',
		path: '/authenticate',
		config: {
			auth: false,
			description: 'Authenticate a user',
			notes: 'Returns a json web token in the Authorization header on success.',
			tags: [ 'api', 'authenticate' ],
			validate: {
				payload: joi.object ({
					username: joi.string ().required (),
					password: joi.string ().required ()
				}).required ()
			},
			plugins: {
				'hapi-swaggered': {
					responses: { 
						'200': { 'description': 'Success' },
						'400': { 'description': 'Bad Request' },
						'401': { 'description': 'Unauthorized' }
					}
				}
			},
			handler: (request, reply) => {
				const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

				users.findOne ({
					$or: [ { username: request.payload.username }, { email: request.payload.username } ],
					password: crypto.createHash ('sha256').update (request.payload.password).digest ('hex'),
					active: true
				}).then ((user) => {
					if (user) {
						reply ().code (200).header ('Authorization', jwt.sign ({
							iss: '<%= appSlug %>',
							exp: parseInt (new Date ().getTime () / 1000, 10) + config.get ('web.tokenExpire'),
							iat: parseInt (new Date ().getTime () / 1000, 10),
							sub: 'auth',
							host: request.info.host,
							user: user._id,
							scope: user.scope
						}, config.get ('web.jwtKey')));
					} else {
						return Promise.reject ();
					}
				}).catch (() => {
					reply (boom.unauthorized ());
				});
			}
		}
	}, {
		method: 'GET',
		path: '/authenticate',
		config: {
			description: 'Refresh the authentication token',
			notes: 'Returns a json web token in the Authorization header on success.',
			tags: [ 'api', 'authenticate' ],
			validate: {
				params: {}
			},
			plugins: {
				'hapi-swaggered': {
					responses: { 
						'200': { 'description': 'Success' },
						'400': { 'description': 'Bad Request' },
						'401': { 'description': 'Unauthorized' }
					}
				}
			},
			handler: (request, reply) => {
				reply ().code (200).header ('Authorization', jwt.sign ({
					iss: '<%= appSlug %>',
					exp: parseInt (new Date ().getTime () / 1000, 10) + config.get ('web.tokenExpire'),
					iat: parseInt (new Date ().getTime () / 1000, 10),
					sub: 'auth',
					host: request.info.host,
					user: request.auth.credentials._id,
					scope: request.auth.credentials.scope
				}, config.get ('web.jwtKey')));
			}
		}
	}<% for (var i = 0; i < socialLogins.length; i++) { %>, {
		method: 'GET',
		path: '/authenticate/<%= socialLogins [i].name %>',
		config: {
			auth: '<%= socialLogins [i].name %>',
			description: 'Authenticate a user via <%= socialLogins [i].cap %>',
			notes: 'Returns a json web token in the Authorization header on success.',
			tags: [ 'api', 'authenticate' ],
			handler: (request, reply) => {
				const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

				users.findOne ({
					username: request.auth.credentials.profile.username,
					provider: '<%= socialLogins [i].name %>',
					active: true
				}).then ((user) => {
					if (!user) {
						user = {
							username: <% if (-1 !== [ 'facebook', 'google', 'linkedin' ].indexOf (socialLogins [i].name)) { %>request.auth.credentials.profile.id<% } else { %>request.auth.credentials.profile.username<% } %>,
							provider: '<%= socialLogins [i].name %>',
							fullName: request.auth.credentials.profile.displayName,
							nickname: <% if (-1 !== [ 'facebook', 'linkedin' ].indexOf (socialLogins [i].name)) { %>request.auth.credentials.profile.name.first<% } else if ('google' === socialLogins [i].name) { %>request.auth.credentials.profile.name.givenName<% } else { %>request.auth.credentials.profile.displayName.split (" ").shift ()<% } %>,
							email: request.auth.credentials.profile.email,
							lang: <% if ('twitter' === socialLogins [i].name) { %>request.auth.credentials.profile.raw.lang<% } else { %>'en'<% } %>,
							active: true,
							created: new Date (),
							scope: [ 'ROLE_USER' ]
						};
						users._id = users.insertOne (user).insertedId;
					}

					reply.view ('jwt', {
						token: jwt.sign ({
							iss: '<%= appSlug %>',
							exp: parseInt (new Date ().getTime () / 1000, 10) + config.get ('web.tokenExpire'),
							iat: parseInt (new Date ().getTime () / 1000, 10),
							sub: 'auth',
							host: request.info.host,
							user: user._id,
							scope: user.scope
						}, config.get ('web.jwtKey'))
					});
				}).catch (() => {
					reply ().code (401);
				});
			}
		}
	}<% } %>];
} ());
