(function () {
	module.exports = function (config) {
		config.set ({
			basePath: '',
			frameworks: [ 'jasmine' ],
			files: [
				'src/web/bower_components/es5-shim/es5-shim.js',
				'src/web/bower_components/es6-shim/es6-shim.js',
				'src/web/bower_components/jquery/dist/jquery.js',
				'src/web/bower_components/bootstrap/dist/js/bootstrap.js',
				'src/web/bower_components/angular/angular.js',
				'src/web/bower_components/angular-aria/angular-aria.js',
				'src/web/bower_components/angular-cookies/angular-cookies.js',
				'src/web/bower_components/angular-sanitize/angular-sanitize.js',
				'src/web/bower_components/angular-local-storage/dist/angular-local-storage.js',
				'src/web/bower_components/angular-translate/angular-translate.js',
				'src/web/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
				'src/web/bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
				'src/web/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
				'src/web/bower_components/angular-ui-router/release/angular-ui-router.js',
				'src/web/bower_components/angular-jwt/dist/angular-jwt.js',
				'src/web/bower_components/angular-swagger-ui/dist/scripts/swagger-ui.js',
				'src/web/bower_components/angular-mocks/angular-mocks.js',
				'src/web/app/**/*.js',
				'test/unit/web/app/**/*.js'
			],
			preprocessors: {
				'src/web/app/**/*.js': [ 'coverage' ]
			},
			reporters: [ 'progress', 'coverage' ],
			coverageReporter: {
				type: 'json',
				dir: 'coverage/',
				subdir: '.',
				file: 'web.coverage.json'
			},
			port: 9876,
			colors: true,
			logLevel: config.LOG_INFO,
			autoWatch: false,
			browsers: [ 'PhantomJS' ],
			phantomjsLauncher: {
				exitOnResourceError: true
			},
			singleRun: true,
			concurrency: Infinity
		});
	};
} ());
