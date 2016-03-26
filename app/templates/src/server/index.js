(function () {
	'use strict';

	const glue = require ('glue'),
		config = require ('config'),
		jwt = require ('./jwt');
	var server;

	module.exports = {
		start () {
			return new Promise ((resolve, reject) => {
				glue.compose (config.get ('manifest'), {
					relativeTo: __dirname,
					preRegister: (server, next) => {
						server.register (require ('hapi-auth-jwt2'), () => {
							server.auth.strategy ('jwt', 'jwt', {
								key: config.get ('web.jwtKey'),
								validateFunc: jwt.validate,
								verifyOptions: {
									algorithms: [ 'HS256' ]
								}
							});

							server.auth.default ('jwt');

							next ();
						});
<%- socialLogin %>					}
				}).then ((_server_) => {
					server = _server_; 

					server.start ().then (() => {
						console.log ('Server started on port: ' + server.info.port);
						resolve (server);
					}).catch ((err) => {
						throw err;
					});
				}).catch ((err) => {	 
					console.error (err);
					reject (err, server);
				});
			});
		},

		stop () {
			return server.stop ();
		}
	};
} ());
