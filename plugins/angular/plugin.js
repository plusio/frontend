PluginConfig({
	name : 'Angular',
	version : '1.2.4',
	files : [
		'angular.js',
		'angular-animate.js',
		'angular-cookies.js',
		'angular-csp.css',
		'angular-loader.js',
		//'angular-mocks.js',
		'angular-resource.js',
		'angular-route.js',
		'angular-sanitize.js',
		'angular-scenario.js',
		'angular-touch.js',
	],
	angularMod : ['ngAnimate', 'ngCookies', 'ngTouch', /*'ngMock', 'mock.animate', 'ngMockE2E',*/ 'ngResource', 'ngRoute', 'ngSanitize', 'ngLocale', 'ngTouch']
});