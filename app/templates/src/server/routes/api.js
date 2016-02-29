(function (exports) {
	'use strict';

	exports.register = function (server, options, next) {
		server.route ({
			method: 'GET',
			path: '/',
			handler: function (request, reply) {
				reply ({
					message: '.'
				}); 
			}   
		}); 

		next();
	};

	exports.register.attributes = { 
		name: 'api'
	};
} (exports));
