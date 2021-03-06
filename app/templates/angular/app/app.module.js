(function () {
	'use strict';

	angular.module ('<%= appSlug %>', [
		'ngAria',
		'ngCookies',
		'ngSanitize',
		'LocalStorageModule',
		'pascalprecht.translate',
		'ui.router',
		'angular-jwt',
		'swaggerUi'
	]).config (function ($urlRouterProvider) {
		$urlRouterProvider.otherwise ('/');
	}).config (function ($translateProvider) {
		$translateProvider.useLocalStorage ();
		$translateProvider.useStaticFilesLoader ({
			prefix: 'assets/locale/locale-',
			suffix: '.json'
		}).preferredLanguage ('en').useSanitizeValueStrategy ('sanitize');
	}).config (function (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix ('<%= appSlug %>');
	}).config (function ($httpProvider, jwtInterceptorProvider) {
		$httpProvider.defaults.xsrfCookieName = 'crumb';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRF-Token';

		jwtInterceptorProvider.tokenGetter = function (config, authFactory) {
			if (-1 !== [ 'html' ].indexOf (config.url.substr (config.url.length - 4))) {
				return null;
			} else {
				return authFactory.token;
			}
		};

		$httpProvider.interceptors.push('jwtInterceptor');
	}).run (function ($rootScope, $state) {
		$rootScope.$on ('$stateChangeSuccess',  function (toState, toParams, fromState, fromParams) {
			if (-1 === ['login', 'reigster' ].indexOf (fromState.name)) {
				$rootScope.previousStateName = fromState.name;
				$rootScope.previousStateParams = fromParams;
			}
		});

		$rootScope.back = function () {
			if (!$rootScope.previousStateName ||  null === $state.get ($rootScope.previousStateName)) {
				$state.go ('home');
			} else {
				$state.go ($rootScope.previousStateName, $rootScope.previousStateParams);
			}
		};
	});
} ());
