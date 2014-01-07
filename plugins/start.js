/*
 * start.js reads the app's configuration file and loads all the necessary files (plugins, themes) and then bootstraps angualar.js
 */


 /*!
  * HeadJS     The only script in your <HEAD>
  * Author     Tero Piirainen  (tipiirai)
  * Maintainer Robert Hoffmann (itechnology)
  * License    MIT / http://bit.ly/mit-license
  *
  * Version 0.99
  * http://headjs.com
  */
 (function(e,t){"use strict";function m(){}function g(e,t){if(!e){return}if(typeof e==="object"){e=[].slice.call(e)}for(var n=0,r=e.length;n<r;n++){t.call(e,e[n],n)}}function y(e,n){var r=Object.prototype.toString.call(n).slice(8,-1);return n!==t&&n!==null&&r===e}function b(e){return y("Function",e)}function w(e){return y("Array",e)}function E(e){var t=e.split("/"),n=t[t.length-1],r=n.indexOf("?");return r!==-1?n.substring(0,r):n}function S(e){e=e||m;if(e._done){return}e();e._done=1}function x(e,t,n,r){var i=typeof e==="object"?e:{test:e,success:!!t?w(t)?t:[t]:false,failure:!!n?w(n)?n:[n]:false,callback:r||m};var s=!!i.test;if(s&&!!i.success){i.success.push(i.callback);c.load.apply(null,i.success)}else if(!s&&!!i.failure){i.failure.push(i.callback);c.load.apply(null,i.failure)}else{r()}return c}function T(e){var t={};if(typeof e==="object"){for(var n in e){if(!!e[n]){t={name:n,url:e[n]}}}}else{t={name:E(e),url:e}}var r=o[t.name];if(r&&r.url===t.url){return r}o[t.name]=t;return t}function N(e){e=e||o;for(var t in e){if(e.hasOwnProperty(t)&&e[t].state!==v){return false}}return true}function C(e){e.state=p;g(e.onpreload,function(e){e.call()})}function k(e,n){if(e.state===t){e.state=h;e.onpreload=[];M({url:e.url,type:"cache"},function(){C(e)})}}function L(){console.log("api load hack");var e=arguments,t=[].slice.call(e,1),n=t[0];if(!a){i.push(function(){c.load.apply(null,e)});return c}if(!!n){g(t,function(e){if(!b(e)&&!!e){k(T(e))}});O(T(e[0]),b(n)?n:function(){c.load.apply(null,t)})}else{O(T(e[0]))}return c}function A(e,t){var n=arguments,r=n[n.length-1],i={};if(!b(r)){r=null}g(e,function(e,t){if(e!==r){e=T(e);i[e.name]=e;O(e,r?function(){if(N(i)){S(r)}}:null)}});return c}function O(e,t){t=t||m;if(e.state===v){t();return}if(e.state===d){c.ready(e.name,t);return}if(e.state===h){e.onpreload.push(function(){O(e,t)});return}e.state=d;M(e,function(){e.state=v;t();g(s[e.name],function(e){S(e)});if(f&&N()){g(s.ALL,function(e){S(e)})}})}function M(t,r){function i(t){t=t||e.event;o.onload=o.onreadystatechange=o.onerror=null;r()}function s(t){t=t||e.event;if(t.type==="load"||/loaded|complete/.test(o.readyState)&&(!n.documentMode||n.documentMode<9)){o.onload=o.onreadystatechange=o.onerror=null;r()}}r=r||m;var o;if(/\.css[^\.]*$/.test(t.url)){o=n.createElement("link");o.type="text/"+(t.type||"css");o.rel="stylesheet";o.href=t.url}else{o=n.createElement("script");o.type="text/"+(t.type||"javascript");o.src=t.url}o.onload=o.onreadystatechange=s;o.onerror=i;o.async=false;o.defer=false;var u=n.head||n.getElementsByTagName("head")[0];u.insertBefore(o,u.lastChild)}function _(){var e=n.getElementsByTagName("script");for(var t=0,r=e.length;t<r;t++){var i=e[t].getAttribute("data-headjs-load");if(!!i){c.load(i);return}}}function D(e,t){if(e===n){if(f){S(t)}else{r.push(t)}return c}if(b(e)){t=e;e="ALL"}if(typeof e!=="string"||!b(t)){return c}var i=o[e];if(i&&i.state===v||e==="ALL"&&N()&&f){S(t);return c}var u=s[e];if(!u){u=s[e]=[t]}else{u.push(t)}return c}function P(){if(!n.body){e.clearTimeout(c.readyTimeout);c.readyTimeout=e.setTimeout(P,50);return}if(!f){f=true;_();g(r,function(e){S(e)})}}function H(){if(n.addEventListener){n.removeEventListener("DOMContentLoaded",H,false);P()}else if(n.readyState==="complete"){n.detachEvent("onreadystatechange",H);P()}}var n=e.document,r=[],i=[],s={},o={},u="async"in n.createElement("script")||"MozAppearance"in n.documentElement.style||e.opera,a,f,l=e.head_conf&&e.head_conf.head||"head",c=e[l]=e[l]||function(){c.ready.apply(null,arguments)},h=1,p=2,d=3,v=4;if(n.readyState==="complete"){P()}else if(n.addEventListener){n.addEventListener("DOMContentLoaded",H,false);e.addEventListener("load",P,false)}else{n.attachEvent("onreadystatechange",H);e.attachEvent("onload",P);var B=false;try{B=!e.frameElement&&n.documentElement}catch(j){}if(B&&B.doScroll){(function F(){if(!f){try{B.doScroll("left")}catch(t){e.clearTimeout(c.readyTimeout);c.readyTimeout=e.setTimeout(F,50);return}P()}})()}}c.load=c.js=u?A:L;c.test=x;c.ready=D;c.ready(n,function(){if(N()){g(s.ALL,function(e){S(e)})}if(c.feature){c.feature("domloaded",true)}});setTimeout(function(){a=true;g(i,function(e){e()})},300)})(window);


var $app,
	defaultViewContent = '<div class="container overthrow"><div class="header"><ul class="nav nav-pills pull-right"> <li class="active"><img src="https://dl.dropboxusercontent.com/u/43803367/logo.png" alt="" height="26px"></li> </ul> <h3 class="text-muted">{{ $page.title }}</h3> </div> <div class="jumbotron"> <h1>Need a view?</h1> <p class="lead">This page was created automatically because we couldn\'t find a view for it, the guide below will get you creating views in no time. Read the docs to learn more about creating themes and views.</p> <p><a class="btn btn-lg btn-success" href="http://plus.io/+docs/" target="_blank" role="button">View the docs</a></p> </div> <h4>Create a view for {{ $page.title }}</h4> <p>To create a view for this page simply create <code>{{ $page.templateUrl }}</code>, copy and paste the following code, save it and refresh this page.</p> <pre style="overflow-x:scroll; font-size:11px;"><code style="min-width:544px" ng-non-bindable>&lt;div class="navbar navbar-inverse navbar-fixed-top"&gt;\n  &lt;div class="container"&gt;\n    &lt;div class="navbar-header"&gt;\n      &lt;a class="navbar-brand" href="#"&gt;{{ $app.name }}&lt;/a&gt;\n    &lt;/div&gt;\n  &lt;/div&gt;\n&lt;/div&gt;\n\n&lt;div class="container"&gt;\n  &lt;div class="starter-template" style="padding:40px 15px;text-align:center;"&gt;\n    &lt;h1&gt;{{$page.title}} Page&lt;/h1&gt;\n      &lt;p class="lead"&gt;Congratulations! you created a view! now customize this one or create one from scratch! and don\'t forget &lt;a href="http://plus.io/+docs/" target="_blank"&gt;our docs&lt;/a&gt; if you need any help.&lt;/p&gt;\n  &lt;/div&gt;\n&lt;/div&gt;</code></pre> <div class="footer"> <p>&copy; Plus.io 2013</p></div></div>';

//Remove no-js class from html element
document.documentElement.classList.remove("no-js");

if(location.href.substr(0, 6) == 'chrome'){
	document.documentElement.classList.add('chrome-extension');
	document.documentElement.setAttribute('ng-csp', '');
}

function PluginConfig(config){
	if(config == null){
		throw Error('No configuration object provided for plugin');
	}

	if(!config.name){
		throw Error('No name provided for plugin');
	}

	if(typeof config.name != 'string'){
		throw Error('Name must be a string in plugin.js, given ' + typeof config.name);
	}

	if(!config.files){
		throw Error('No files included in plugin.js for ' + config.name);
	}

	if(!(config.files instanceof Array)){
		throw Error('Files must be an array of relative or remote paths that the plugin requires (' + config.name + ')');
	}

	if(!app.loadedPlugins)
		app.loadedPlugins = {};

	app.loadedPlugins[config.name] = config;
}

function ThemeConfig(config){
	if(config == null){
		throw Error('No configuration object provided for theme');
	}

	if(!config.name){
		throw Error('No name provided for theme');
	}

	if(typeof config.name != 'string'){
		throw Error('Name must be a string in theme.js, given ' + typeof config.name);
	}

	if(config.files && !(config.files instanceof Array)){
		throw Error('Files must be an array of relative or remote paths that the theme requires (' + config.name + ')');
	}

	if(!config.routes){
		throw Error('No routes specified in theme.js for ' + config.name);
	}

	app.theme = config;
}

function generateView(route){
	var parts = route.split('/'),
		view = app.theme.path + '/views/';

	parts.forEach(function(part, i, arr){
		if(part.substr(0,1) != ':')
			view += (i > 0?'.':'') + part;

		view += (i == arr.length - 1)?'.html':'';
	});

	return view;
}

function generateController(route){
	var parts = route.split('/'),
		controller = '';

	parts.forEach(function(part, i, arr){
		if(part.substr(0,1) != ':')
			controller += (i > 0?part.charAt(0).toUpperCase():part.charAt(0)) + part.slice(1);
	});

	return controller;
}

function generateRoute(route){
	if(route.substr(0,1) == '/')
		route = route.slice(1);

	if(route.substr(-1) == '/')
		route = route.slice(0, -1);

	return route;
}

function generateTitle(route){
	titleParts = route.split('/');
	titleParts = titleParts.map(function(word){
		if(word.charAt(0) == ':')
			return '';
		else
			return word.charAt(0).toUpperCase() + word.slice(1);
	});

	return titleParts.join(' ');
}

function generateClass(route){
	var parts = route.split('/');
	return parts.join('-');
}

(function(){
	'use strict';
	function loadPlugins(){
		var supportFilePaths = [];
		Object.keys(app.loadedPlugins).forEach(function(name, i) {
			app.loadedPlugins[name].files.forEach(function(file){
				var ext = file.split('.').pop(),
					isRemote = (file.substr(0,4) == 'http'),
					path = ((isRemote)?'':'plugins/' + app.plugins[i] + '/') + file;

				switch(ext){
					case 'js':
						supportFilePaths.push(path);
						break;
					case 'css':
						supportFilePaths.push(path);
						break;
					default:
						console.log(ext + ' files are not supported, please use only css or js files. ' + '(' + app.plugins[i] + ')');
						break;
				}
			});
		});

		app.plugins = app.loadedPlugins;
		delete app.loadedPlugins;

		head.js(supportFilePaths, loadTheme);
	}

	function loadTheme(){
		var themeFolder = angular.copy(app.theme),
			themefiles = [];
		head.js(['themes/' + app.theme + '/theme.js'], function(){
			app.theme.path = 'themes/' + themeFolder;
			if(typeof app.theme !== 'object'){
				throw Error('Error loading theme.\nCheck that you have a theme installed in your config.js, and themes folder.');
			}

			if(app.theme.files){
				app.theme.files.forEach(function(file){
					var ext = file.split('.').pop(),
						isRemote = (file.substr(0,4) == 'http'),
						path = ((isRemote)?'':app.theme.path + '/') + file;

					switch(ext){
						case 'js':
							themefiles.push(path);
							break;
						case 'css':
							themefiles.push(path);
							break;
						default:
							console.log(ext + ' files are not supported, please use only css or js files. ' + '(' + app.theme.name + ')');
							break;
					}
				});
			}

			if(themefiles.length == 0)
				initApp(); // head.js won't run the callback with no files to load

			head.js(themefiles, loadApp);
		});
	}

	function loadApp(){
		var deps = [];

		for(var plugin in app.plugins){
			if(app.plugins.hasOwnProperty(plugin)){
				plugin = app.plugins[plugin];
				if(plugin.hasOwnProperty('angularMod')){
					deps = deps.concat(plugin.angularMod);
				}
			}
		}
		
		$app = angular.module('myApp', deps);
		
		if (typeof app.files != 'undefined'){
			if(!(app.files instanceof Array))
				throw Error('Files must be an array of file paths relative from the root of your app.');

			if(app.files.length == 0)
				initApp(); // head.js won't run the callback with no files to load

			head.js(app.files, initApp);
		}else{
			//no files to load
			initApp();
		}
	}

	function initApp(){

		var routeDetails = [];

		app.theme.routes.forEach(function(routeConfig, r){
			var routeOpts = {}, route;

			if(typeof routeConfig == 'string'){
				route = generateRoute(routeConfig)
				routeOpts.routePath = '/' + route;
				routeOpts.templateUrl = generateView(route);
				routeOpts.controller = generateController(route);
				routeOpts.title = generateTitle(route);
				routeOpts.class = generateClass(route);
				
			}else if(typeof routeConfig == 'object' && !(routeConfig instanceof Array)){
				
				if(routeConfig.route){
					route = generateRoute(routeConfig.route)
					routeOpts.routePath = '/' + route;
					routeOpts.templateUrl = generateView(routeConfig.view || route);
					routeOpts.controller = (routeConfig.controller)?routeConfig.controller:generateController(route);
					routeOpts.title = (routeConfig.title)?routeConfig.title:generateTitle(route);
					routeOpts.class = (routeConfig.class)?routeConfig.class:generateClass(route);

					delete routeConfig.route;
					delete routeConfig.view;

					routeOpts = angular.extend(routeOpts, routeConfig);
				}else{
					console.log('Route must be specified: index ' + r);
					return;
				}

			}else{
				console.log('Malformed route specified: index ' + r);
				return;
			}

			routeDetails.push(routeOpts);			
			
			//create controllers so if no controllers are created the views still have basic functionality
			$app.controller(routeOpts.controller, ['$scope', '$routeParams', '$window', function(scope, params, $window){
				scope.routeParams = params;
				scope.window = $window;
			}]);

		});

		head.js(['app.js'], function(){

			$app.config(['$routeProvider', function($routeProvider){
				routeDetails.forEach(function(details){ 
					$routeProvider.when(details.routePath, details);
				});

				$routeProvider.otherwise({ redirectTo: routeDetails[0].routePath});
			}]);

			$app.run(['$rootScope','$route','$http', '$templateCache', function($rootScope,$route,$http,$templateCache){
				routeDetails.forEach(function(details){
					$http.get(details.templateUrl, {cache:$templateCache}).error(function(result,status){
						if(status == 404 || status == 0){
							$route.routes[details.routePath].template = defaultViewContent;
							if($route.current.$$route.originalPath == details.routePath)
								$route.reload();
						}
					});
				});

				$rootScope.$on('$routeChangeStart', function(next, current) { 
				   $rootScope.$page = current.$$route;
				});
				$rootScope.$app = app;
				$rootScope.$app.theme.view = function(view){
					return this.path + '/views/' + view + '.html';
				}
			}]);

			angular.bootstrap(document, ['myApp']);
		});
	}

	var plugins = app.plugins.map(function(plugin){
		return 'plugins/' + plugin + '/plugin.js'; 
	});

	head.js(plugins, loadPlugins);

})();