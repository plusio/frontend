/*
 * init.js Initialize the plus.io Frontend and load in configuration file then load in all necessary scripts
 */

 window.phonegap = (document.URL.indexOf("http://") == -1);


// if the url is a callback from google signon redirect to a system controller to get the values into angular and run the use service.
if(document.location.href.search("access_token=") > -1 && document.location.href.search("token_type=") > -1 && document.location.href.search("expires_in=") > -1){
	document.location ="#/BqeQVHV/"+location.hash.substr(1);
}else if(document.location.href.search('error=') > -1 && document.location.href.search("error_description=") > -1){
	document.location ="#/BqeQVHV/"+location.hash.substr(1);
}

 // Include a third party loader script to load in files
/*!
 * HeadJS     The only script in your <HEAD>    
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 *
 * Version 0.99
 * http://headjs.com
 */
(function(a,w){function f(a){p[p.length]=a}function m(a){q.className=q.className.replace(RegExp("\\b"+a+"\\b"),"")}function k(a,d){for(var b=0,c=a.length;b<c;b++)d.call(a,a[b],b)}function s(){q.className=q.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g,"");var b=a.innerWidth||q.clientWidth,d=a.outerWidth||a.screen.width;h.screen.innerWidth=b;h.screen.outerWidth=d;f("w-"+b);k(c.screens,function(a){b>a?(c.screensCss.gt&&f("gt-"+a),c.screensCss.gte&&f("gte-"+a)):b<a?(c.screensCss.lt&&f("lt-"+a),c.screensCss.lte&&f("lte-"+a)):b===a&&(c.screensCss.lte&&f("lte-"+a),c.screensCss.eq&&f("e-q"+a),c.screensCss.gte&&f("gte-"+a))});var d=a.innerHeight||q.clientHeight,g=a.outerHeight||a.screen.height;h.screen.innerHeight=d;h.screen.outerHeight=g;h.feature("portrait",d>b);h.feature("landscape",d<b)}function r(){a.clearTimeout(u);u=a.setTimeout(s,100)}var n=a.document,g=a.navigator,t=a.location,q=n.documentElement,p=[],c={screens:[240,320,480,640,768,800,1024,1280,1440,1680,1920],screensCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!1},browsers:[{ie:{min:6,max:10}}],browserCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!0},section:"-section",page:"-page",head:"head"};if(a.head_conf)for(var b in a.head_conf)a.head_conf[b]!==w&&(c[b]=a.head_conf[b]);var h=a[c.head]=function(){h.ready.apply(null,arguments)};h.feature=function(a,b,c){if(!a)return q.className+=" "+p.join(" "),p=[],h;"[object Function]"===Object.prototype.toString.call(b)&&(b=b.call());f((b?"":"no-")+a);h[a]=!!b;c||(m("no-"+a),m(a),h.feature());return h};h.feature("js",!0);b=g.userAgent.toLowerCase();g=/mobile|midp/.test(b);h.feature("mobile",g,!0);h.feature("desktop",!g,!0);b=/(chrome|firefox)[ \/]([\w.]+)/.exec(b)||/(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(b)||/(android)(?:.*version)?[ \/]([\w.]+)/.exec(b)||/(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(b)||/(msie) ([\w.]+)/.exec(b)||[];g=b[1];b=parseFloat(b[2]);switch(g){case "msie":g="ie";b=n.documentMode||b;break;case "firefox":g="ff";break;case "ipod":case "ipad":case "iphone":g="ios";break;case "webkit":g="safari"}h.browser={name:g,version:b};h.browser[g]=!0;for(var v=0,x=c.browsers.length;v<x;v++)for(var i in c.browsers[v])if(g===i){f(i);for(var A=c.browsers[v][i].max,l=c.browsers[v][i].min;l<=A;l++)b>l?(c.browserCss.gt&&f("gt-"+i+l),c.browserCss.gte&&f("gte-"+i+l)):b<l?(c.browserCss.lt&&f("lt-"+i+l),c.browserCss.lte&&f("lte-"+i+l)):b===l&&(c.browserCss.lte&&f("lte-"+i+l),c.browserCss.eq&&f("eq-"+i+l),c.browserCss.gte&&f("gte-"+i+l))}else f("no-"+i);"ie"===g&&9>b&&k("abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video".split(" "),function(a){n.createElement(a)});k(t.pathname.split("/"),function(a,b){if(2<this.length&&this[b+1]!==w)b&&f(this.slice(1,b+1).join("-").toLowerCase()+c.section);else{var g=a||"index",h=g.indexOf(".");0<h&&(g=g.substring(0,h));q.id=g.toLowerCase()+c.page;b||f("root"+c.section)}});h.screen={height:a.screen.height,width:a.screen.width};s();var u=0;a.addEventListener?a.addEventListener("resize",r,!1):a.attachEvent("onresize",r)})(window);(function(a,w){function f(a){var f=a.charAt(0).toUpperCase()+a.substr(1),a=(a+" "+r.join(f+" ")+f).split(" "),c;a:{for(c in a)if(k[a[c]]!==w){c=!0;break a}c=!1}return!!c}var m=a.document.createElement("i"),k=m.style,s=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),r=["Webkit","Moz","O","ms","Khtml"],n=a[a.head_conf&&a.head_conf.head||"head"],g={gradient:function(){k.cssText=("background-image:"+s.join("gradient(linear,left top,right bottom,from(#9f9),to(#fff));background-image:")+s.join("linear-gradient(left top,#eee,#fff);background-image:")).slice(0,-17);return!!k.backgroundImage},rgba:function(){k.cssText="background-color:rgba(0,0,0,0.5)";return!!k.backgroundColor},opacity:function(){return""===m.style.opacity},textshadow:function(){return""===k.textShadow},multiplebgs:function(){k.cssText="background:url(//:),url(//:),red url(//:)";return/(url\s*\(.*?){3}/.test(k.background)},boxshadow:function(){return f("boxShadow")},borderimage:function(){return f("borderImage")},borderradius:function(){return f("borderRadius")},cssreflections:function(){return f("boxReflect")},csstransforms:function(){return f("transform")},csstransitions:function(){return f("transition")},touch:function(){return"ontouchstart"in a},retina:function(){return 1<a.devicePixelRatio},fontface:function(){var a=n.browser.version;switch(n.browser.name){case "ie":return 9<=a;case "chrome":return 13<=a;case "ff":return 6<=a;case "ios":return 5<=a;case "android":return!1;case "webkit":return 5.1<=a;case "opera":return 10<=a;default:return!1}}},t;for(t in g)g[t]&&n.feature(t,g[t].call(),!0);n.feature()})(window);(function(a,w){function f(){}function m(j,a){if(j){"object"===typeof j&&(j=[].slice.call(j));for(var b=0,c=j.length;b<c;b++)a.call(j,j[b],b)}}function k(a,b){var e=Object.prototype.toString.call(b).slice(8,-1);return b!==w&&null!==b&&e===a}function s(a){return k("Function",a)}function r(a){a=a||f;a._done||(a(),a._done=1)}function n(a){var b={};if("object"===typeof a)for(var e in a)a[e]&&(b={name:e,url:a[e]});else b=a.split("/"),b=b[b.length-1],e=b.indexOf("?"),b={name:-1!==e?b.substring(0,e):b,url:a};return(a=i[b.name])&&a.url===b.url?a:i[b.name]=b}function g(a){var a=a||i,b;for(b in a)if(a.hasOwnProperty(b)&&a[b].state!==y)return!1;return!0}function t(a,b){b=b||f;a.state===y?b():a.state===D?d.ready(a.name,b):a.state===C?a.onpreload.push(function(){t(a,b)}):(a.state=D,q(a,function(){a.state=y;b();m(x[a.name],function(a){r(a)});u&&g()&&m(x.ALL,function(a){r(a)})}))}function q(j,c){var c=c||f,e;/\.css[^\.]*$/.test(j.url)?(e=b.createElement("link"),e.type="text/"+(j.type||"css"),e.rel="stylesheet",e.href=j.url):(e=b.createElement("script"),e.type="text/"+(j.type||"javascript"),e.src=j.url);e.onload=e.onreadystatechange=function(j){j=j||a.event;if("load"===j.type||/loaded|complete/.test(e.readyState)&&(!b.documentMode||9>b.documentMode))e.onload=e.onreadystatechange=e.onerror=null,c()};e.onerror=function(){e.onload=e.onreadystatechange=e.onerror=null;c()};e.async=!1;e.defer=!1;var d=b.head||b.getElementsByTagName("head")[0];d.insertBefore(e,d.lastChild)}function p(){b.body?u||(u=!0,m(h,function(a){r(a)})):(a.clearTimeout(d.readyTimeout),d.readyTimeout=a.setTimeout(p,50))}function c(){b.addEventListener?(b.removeEventListener("DOMContentLoaded",c,!1),p()):"complete"===b.readyState&&(b.detachEvent("onreadystatechange",c),p())}var b=a.document,h=[],v=[],x={},i={},A="async"in b.createElement("script")||"MozAppearance"in b.documentElement.style||a.opera,l,u,B=a.head_conf&&a.head_conf.head||"head",d=a[B]=a[B]||function(){d.ready.apply(null,arguments)},C=1,D=3,y=4;d.load=A?function(){var a=arguments,b=a[a.length-1],e={};s(b)||(b=null);m(a,function(c,d){c!==b&&(c=n(c),e[c.name]=c,t(c,b&&d===a.length-2?function(){g(e)&&r(b)}:null))});return d}:function(){var a=arguments,b=[].slice.call(a,1),c=b[0];if(!l)return v.push(function(){d.load.apply(null,a)}),d;c?(m(b,function(a){if(!s(a)){var b=n(a);b.state===w&&(b.state=C,b.onpreload=[],q({url:b.url,type:"cache"},function(){b.state=2;m(b.onpreload,function(a){a.call()})}))}}),t(n(a[0]),s(c)?c:function(){d.load.apply(null,b)})):t(n(a[0]));return d};d.js=d.load;d.test=function(a,b,c,g){a="object"===typeof a?a:{test:a,success:b?k("Array",b)?b:[b]:!1,failure:c?k("Array",c)?c:[c]:!1,callback:g||f};(b=!!a.test)&&a.success?(a.success.push(a.callback),d.load.apply(null,a.success)):!b&&a.failure?(a.failure.push(a.callback),d.load.apply(null,a.failure)):g();return d};d.ready=function(a,c){if(a===b)return u?r(c):h.push(c),d;s(a)&&(c=a,a="ALL");if("string"!==typeof a||!s(c))return d;var e=i[a];if(e&&e.state===y||"ALL"===a&&g()&&u)return r(c),d;(e=x[a])?e.push(c):x[a]=[c];return d};d.ready(b,function(){g()&&m(x.ALL,function(a){r(a)});d.feature&&d.feature("domloaded",!0)});if("complete"===b.readyState)p();else if(b.addEventListener)b.addEventListener("DOMContentLoaded",c,!1),a.addEventListener("load",p,!1);else{b.attachEvent("onreadystatechange",c);a.attachEvent("onload",p);var z=!1;try{z=null==a.frameElement&&b.documentElement}catch(F){}z&&z.doScroll&&function E(){if(!u){try{z.doScroll("left")}catch(b){a.clearTimeout(d.readyTimeout);d.readyTimeout=a.setTimeout(E,50);return}p()}}()}setTimeout(function(){l=!0;m(v,function(a){a()})},300)})(window);

var $app; //inilize the $app variable at a global level
var settings;

/*
 * Load:
 * 3rd party libraries
 * angular + angular services
 * default angular modules
 * Configuration file
 * angular app.js
 * framework modules
 */
loadCss ("system/vendor/angular-mobile-nav/mobile-nav.css");
loadCss ("system/includes/fonts/roboto-fontfacekit/stylesheet.css");
head.js(
	"phonegap.js",
	"system/vendor/jquery/jquery-2.0.0.min.js",
	"system/vendor/EightMedia/hammer-1.0.5.min.js",
	"system/vendor/underscore/underscore.js",
	{libs : "system/vendor/alexei/sprintf.min.js"},
	{angular : "system/vendor/angular/angular.js" },
	"system/vendor/angular/angular-resource.js",
	"system/vendor/angular/angular-sanitize.js",
	"system/vendor/angular/angular-cookies.js",
	// "system/vendor/mgonto/restangular.js",
	"system/vendor/angular-mobile-nav/mobile-nav.js",
	"system/vendor/angular-retina/angular-retina.js",
	"system/vendor/wzr1337/gestures-0.1.0.min.js",
	"system/vendor/getify/minify.json.js",
	"system/vendor/btford/angular-phonegap-ready.0.0.1.js",
	"system/vendor/btford/angular-phonegap-geolocation.0.0.1.js",
	"system/vendor/btford/angular-phonegap-accelerometer.0.0.1.js",
	"system/vendor/btford/angular-phonegap-notification.0.0.1.js",
	"system/vendor/localstoragedb/localstoragedb.js",
	{vendor : "system/vendor/wzr1337/scrollable-4.2.5.min.js" }, //labeling the last of each section so that we can run functions at certain times of the loading process
	"system/scripts/services/plus-google-signon.js",
	// "system/scripts/services/plus-geolocation.js",
	"system/scripts/services/plus-api.js",
	"system/scripts/services/plus.js",	
	"system/scripts/services/datasync.js",
	"system/scripts/services/plus-connection.js",
	"system/scripts/directives/plus-template.js",
	"system/scripts/directives/plus-table.js",
	"system/scripts/directives/plus-menu.js",
	"system/scripts/directives/plus-data.js",
	"system/scripts/directives/plus-auth.js",
	{system : "system/scripts/directives/plus-resize.js" }
);

head.ready('angular', function(){
	$app = angular.module('app.dependencies', [
		'ngResource',
		'ngSanitize',
		'ngCookies',
		'ajoslin.mobile-navigate',
		'ngRetina',
		'angular-momentum-scroll',
		'angular-gestures',
		'btford.phonegap.ready',
		'btford.phonegap.geolocation',
		'btford.phonegap.accelerometer',
		'btford.phonegap.notification'
	]);
})

head.ready(function(){
	settings = {
		app : {
			name : '',
			google_id : '',
			google_secret : '',
			google_scope : '',
			google_redirect : '',
			server_url : '',
			server_secrect : '',
			environment : 'development',
			theme : 'twentythirteen',
			restEntities : '',
			syncLoopDelay : 600000,
			data_sync : true,
			plugins : [],
			scripts : ['controllers']
		},
		theme : {},
		plugins : {}
	};

	$.ajaxSetup({
		async: false
	});

	$.getJSON( 'app/config.json', function(data){
		settings.app = _.defaults(data, settings.app);
	})
	.fail(function(jqxhr) {
		switch(jqxhr.status){
			case 404:
				console.log('error: no app configuration file found');
				break;
			case 200:
				try{
					tryJSON = JSON.parse(JSON.minify(jqxhr.responseText));
					settings.app = _.defaults(tryJSON, settings.app);

					console.log('Remove all comments from your app configuration for better performance');
				}catch(err){
					console.log(sprintf('App configuration file found but it is not in the expected JSON format. \nError Message: %s', err.message));
				}
				break;
		}
	});


	$.getJSON( sprintf("app/themes/%1$s/%1$s.json", settings.app.theme), function(data) {
		settings.theme = data;
	})
	.fail(function(jqxhr) { 
		loadError(jqxhr, settings.app.theme, 'theme');
	});

	$.each(settings.app.plugins, function(i, val){
		$.getJSON( sprintf("app/plugins/%1$s/%1$s.json", val), function(data) {
		  settings.plugins[val] = data;
		})
		.fail(function(jqxhr) { 
			loadError(jqxhr, val, 'plugins');
		});
	});

	$.ajaxSetup({
		async: true
	});

	//Load in plug in files
	$.each(settings.plugins, function(i, plugin) {
		$.each(plugin.files, function(j, file) {
			parts = file.split('.');
			if(_.last(parts) === 'js'){
				lastHeadScript = file;
				head.js(sprintf('app/plugins/%s/%s', i, file));
			}else if(_.last(parts) === 'css'){
				loadCss(sprintf('app/plugins/%s/%s', i, file));
			}
		});
	});

	//Load app files
	head.ready( function(){
		$.each(settings.app.scripts, function(i, val) {
			head.js('app/includes/scripts/' + val + '.js');
		});
	});

	//Load in theme files
	head.ready( function(){
		$.each(settings.theme.files.css, function(i, file){
			loadCss(sprintf('app/themes/%s/%s.css', settings.app.theme, file));
		});

		$.each(settings.theme.files.js, function(i, file) {
			head.js(sprintf('app/themes/%s/%s.js', settings.app.theme, file));
		});
	});

	//bootstrap angular
	head.ready( function(){
		head.js("system/setup/app.js", function(){
			angular.bootstrap(document, ['app']);
		});
	});


	/*
	 * Disable 'elastic scrolling' on ios to make your app feel more native.
	 * This javascript soulution is for ios devices,
	 * look at style.css for OSX Lion solution.
	 *
	 * http://www.smilingsouls.net/Blog/20110804114957.html
	 */

	document.addEventListener('touchmove', function(e) {
	    e.preventDefault();
	  }, false
	);
});

function loadCss(path){
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = path;
	document.getElementsByTagName("head")[0].appendChild(link);
}

/*
 * Error handling for getting plugin and theme config files
 * if the file doesn't exist warn the user that there is no config file for that theme/plugin
 * otherwise check if the json file had comments in it by minifying it and attempting to parse, if so warn there user that comments in config files will impact performance
 * lastly if all fails, warn the user that the file is not in valid json.
 */
function loadError(jqxhr, val, type) {
	switch(jqxhr.status){
		case 404:
			if(settings.app.environment == 'development') console.log(sprintf('error: no configuration file found for %s %s', type, val));
			break;
		case 200:
			try{
				tryJSON = JSON.parse(JSON.minify(jqxhr.responseText));
				typeIndex = type;
				settings[typeIndex] = tryJSON;
				if(settings.app.environment == 'development') console.log(sprintf('Remove all comments from %s\'s %s configuration for better performance', val, type));
			}catch(err){
				if(settings.app.environment == 'development') console.log(sprintf('Configuration file found for %s %s, but it is not in the expected JSON format. \nError Message: %s', type, val, err.message));
			}
			break;
	}
}