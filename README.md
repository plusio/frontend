<section id="table-of-content">
##Table of Contents
- [Getting Started][getting-started]
- [Creating a theme and theme.js][theme-js]
- [Creating controllers and app.js][creating-controllers]
- [Add plugins to your app][add-plugins]
- [Create plugins to share or sell][create-plugins]
- [Disabling same origin policy][same-origin]
- [API reference*][api-link]
- [Development Environment][development]
</section>
<section id="getting-started">
##Getting Started

First you'll need to [download][repo] and unzip the Plus.io frontend or clone our git repo for the latest build: `git clone https://github.com/plusio/frontend.git`
	
It's recommended to open the frontend with a web server like [mamp][mamp-link] (mac) or [xampp][xampp-link] (everything). You can also view your app by double clicking on the index.html in the root of the folder.

note: to open the index.html file without a web server you will need to [disable the same origin policy][same-origin] for your browser.

###Whats next
Get started by editing the default app and [customizing the theme's views][custom-views], or follow our guide on [creating a new app][create-new-app] from scratch.
</section>

<section id="theme-js">
##Creating a theme and theme.js
Themes are a collection of html, javascript and css files that create an interface for the app. Themes should be designed to support many different apps, which are changed only by the data provided from the app's controllers in `app.js`.

To begin to create a theme, you can clone our [basic theme starter]() or begin from scratch and make a folder in the themes directory and give it a name (e.g., `my-theme`) with a file named `theme.js` in the root with the following code.

	ThemeConfig({
		name : 'Hello World',
		version : '1.0',
		files : [''],
		routes : ['home']
	});
	
Edit these fields as you please, but let's explain what's going on here.

- *name* - is the name of your Theme, and is not used for anything other than display purposes.
- *version* - is the version of your theme.
- *files* - an Array of filenames (except view html files) to be loaded with your theme relative from the root of your theme folder.
- *routes* - an Array of string's that will be your route path. View [Routes for more info][route-link]

Now if you navigate your browser to application, http://localhost/myApp, you should see the default view with instructions on how to create your own view.

![screenshot of default route](http://)
(Screenshot of default route)

To create the view, create `home.html` in `themes/[your theme]/views/` and add the following to the contents of the file.

	<div class="navbar navbar-inverse navbar-fixed-top">
	  <div class="container">
	    <div class="navbar-header">
	      <a class="navbar-brand" href="#">{{ $app.name }}</a>
	    </div>
	  </div>
	</div>
	
	<div class="container">
	  <div class="starter-template" style="padding:40px 15px;text-align:center;">
	    <h1>{{$page.title}} Page</h1>
	      <p class="lead">Congratulations! you created a view! now customize this!</p>
	  </div>
	</div>

###Adding Styles
To style our app with some css we're going to create a `css` folder in the root of your folder. Once that is complete create a `style.css` files in the css directory and add the following to the file.

  	.some-css{
  	
  	}
   
  	.goes-here{
  	
 	{  
 	  	
Next we'll tell Plus.io to load this file with our theme, by opening theme.js and add the path to the files relative to the root of the themes folder to the `files` array.

	{
		files: ['css/styles.css']
	}
	
Now refresh your app and you will see your styles applied, if you notice that sometimes things are not changing you may need to [clear your cache][development].
Create and add as many files as needed, you can even include JavaScript files, but it is recommend to convert them in a [plugin][create-plugins]



<a name="theme-route"></a>
###Routes

The routes array can contain strings that will define the pages of the app. When the route is defined this way the name of the controller, and the filename for the template will be assumed.

The controller and file names can be predicted using the following method.
####Views
- Dashes stay dashes
- Forward slashes become periods
- Url parameters preceded with a `:` will be ignored


####Controllers
- Dashes stay dashes
- Forward slashes are removed and the next word is capitalized
- Url parameters preceded with a `:` will be ignored

#####Examples
Theme.js          | Controller Name | Template filename
----------------- | --------------- | -----------------
home              | home            | home.html
account-info      | account-info    | account-info.html
users/list        | usersList       | users.list.html
users/:id         | users           | users.html
users/:id/history | usersHistory    | users.history.html

###Custom route config
Instead of relying on the auto generated names for controllers and template files, you can pass in an object instead of a string with the options. If a key is omitted it will be auto generated (i.e., if only the controller is named, the template filename will be assumed.)

- *route* - The url path.
- *controller* - The controller name.
- *view* - The filename for the view, the **.html** extension will be appended for you.
- *layout* - NEEDS TO BE DOCUMENTED

example:

	routes : ['home', 'users', {
		route : 'my-route',
		controller : 'myController',
		view : 'myView',
		myKey : 'custom value'
	}]
	
If you are familiar with [Angular.js Routes][angular-route] any additional key-value pairs will be added to the Angular route object.


###Variables available to views
When creating views there are two variables that may be helpful to display information or style the page.

Inside of the templating brackets `{{ }}` you can grab `$app` and `$page` which contain the following data. For more information view these in the [API's][app-api] section

	//$app
	{
  		"name": "Plus.io Frontend",
  		"plugins": {...},
  		"theme": {...},
  		"projectId": "",
  		"serverSecret": "",
  		"pageTransition": "slide-left"
	}
	
	//$page
	{
  		"routePath": "/home",
  		"templateUrl": "themes/hello-world/views/home.html",
  		"controller": "home",
  		"title": "Home",
  		"class": "home"
	}


</section>

<section id="create-controllers">
##Creating controllers and app.js
**app.js** is in the root of your application's directory and this file will contain all of the logic for the app. Once you have specified routes in your theme.js, you can immediately navigate to those pages in your web browser. However if there is no html file for the view then it will display a place holder page with instructions on [how to create that routes view][theme-js]. If there is a view for the route to display then you can use a controller to get data, write functions for user interactions and anything else you might need.

When you successfully create a route and have a view, if there is no controller created for the current route, there is still a limited amount of functionality you can achieve. With no controller, in the view you have access to the following variables.

 - *$page* - Contains information about this [page][page-api]
 - *$app* - Containers information about the [app][app-api]
 - *$routeParams* - An object containing key/value pairs of the url parameters (if any)
 - *$window* - A copy of the JavaScript `window` object, because variables not on scope are not available within the template's braces, including Global variables
 
###Your own controllers
Most of the time you'll need to create your own controllers for the specific functionality of your app. Open your `app.js	` in the root of the app folder and copy and paste the following into it.

	$app.controller('yourController', function($scope){
		$scope.randomNumber = Math.floor(Math.random()*11);
	});
	
Replace "yourController" with the actual name of your controller defined in theme.js, and add replace your view with this code.

	<h1>Your randomly generated numner is {{ randomNumber }}</h1>
	
Now if you reload your page you should a header with a random number in it.

####$scope?
You might be asking what that `$scope` variable it that's being passed into the controller function. It's one of Angular's many services and creating variable's or functions on `$scope` make them instantly available in your view through two-way data binding. To learn more about this visit the [Angular Docs][angular-docs], or this fantastic tutorial about [Angular's Scope][angular-scope].


</section>

<section id="add-plugins">
##Add plugins to your app
Once you have a plugin that you want to install, installation is very easy.

All of the plugin's files should be contained into one folder. To install the plugin simple copy and paste the plugin into the plugins folder inside of your apps directory named in the same format as `my-plusio-plugin`.

Now that the files are in place we need to tell Plus.io, so that it can load it. Open your `config.js` and add the name of the plugin's folder to the plugins array.

	{
		plugins: ['jQuery', 'angular', 'my-plusio-plugin']
	}
	
Plus.io will know what files it needs load based on the plugin's `plugin.js`
</section>

<section id="create-plugins">
##Create plugins to share or sell
Plugins are just regular JavaScript files that can be included into an app easily through the config.js. Plugins can be custom code, angular modules, jQuery plugins, or even the jQuery library itself.

Even all of our api's are provided through a plugin so that the core is lightweight and minimal.

When creating a plugin there are no unique apis to work with in plugins except for the `app` and `plus` [apis][api-link] globally available to the app. 

###Plugin Structure
A plugin consists of your files (js or css) in a folder with **plugin.js**, which tells Plus.io what files it needs to load for your plugin.

folder structure:

	my-time
		theTime.js
		styles.css
		plugin.js*
		
####theTime.js

	alert('My plugin has loaded');
	function myTime(){
		reruns new Date().getTime();
	}
	
####style.css
	
	.clock{
		display: block;
		background: #222;
		color: #c0ffee;
		font-size: 32px;
		}

####plugin.js

	PluginConfig({
		name : 'My Time',
		files : ['theTime.js', 'style.css'],
		version : '1.0.0'
	});
	
###Putting an angular module into a plugin
Angular modules are great and the preferred method of creating plugins as Plus.io is built around Angular.js If you've made angular modules before you'll know that it needs to be injected into the angular app like this `var app = angular.module('myApp', ['yourModule'])`

This is abstracted away form the user for an easier experience. To include your module into angular simply provide `angularMod` with an array of your dependencies in plugin.js and they will be auto injected into angular.

Example:

####myDirective.js

	angular.module('myCustomDirective', [])
  	.directive('go', ['$rootScope', function($rootScope){
  		// Do some directive stuff
  	}]);

####plugin.js
	PluginConfig({
		name : 'My Angular mod',
		files : ['myDirective.js'],
		version : '1.0.0',
		angularMod : ['myCustomDirective'];
	});

</section>

<section id="disable-same-origin">
##Disabling the same origin policy
If you want to open the fronted with out a web server, by double clicking on index.html, or need to make http post requests to the Plus.io api you'll need to disable the security implemented by your browser.

It is important to note that this not an issue when the app the packaged with PhoneGap.

**For all browsers and operating systems, you need to close all browser windows and use the Terminal or Command Line**

###Google Chrome
####Mac
    $ open -a Google\ Chrome --args --disable-web-security
####Linux
    $ google-chrome --disable-web-security
####Windows
	C:\Program Files\Chrome\Chrome.exe --disable-web-security

---
###Safari

####Mac
	open -a '/Applications/Safari.app' --args --disable-web-security
####Windows
	C:\Program Files\Safari\Safari.exe --disable-web-security
---
###Firefox

Firefox users can install the [Force Cors][force-cors] Add-on to disable the security.
</section>


<section id="apis">
#APIs
 - [App][app-api] - Variables and function to access app information
 - [Page][page-api] - Variables and function to access app information
 - [Theme][theme-api] - Create a theme that establishes routes and views
 - [Plugins][plugins-api] - Create a plugin that can add functionality
 - [Collection][collection-api] - Api reference to get and save data from Plus.io API
 
---
<section id="app-api">
##App
The app's object will contain data on the the name, theme, installed plugins, and help functions.

The object is globally accessible by `app`.

methods:

 - *app.name* - The name of app set in config.js
 - *app.plugin* - A list of loaded plugins with populated from the plugin's config
 - *app.theme* - List of settings populated with the theme's config
 
 This object will also contain any custom information set in config.js
</section>
<section id="page-api">
##Page
"routePath": "/home",
    "templateUrl": "themes/hello-world/views/home.html",
    "controller": "home",
    "title": "Home",
    "class": "home"
This variable is available in every view as `$page` within the template curly braces (e.g, `{{ $page.title }}`).

 - *$page.routePath* - The url route for the current Route
 - *$page.controller* - The of the controller for the current Route
 - *$page.title* - The generated title (or specified Title from theme.js) for the current Route
 - *$page.class* - The generated or specified css class for the current Page.
</section>
<section id="theme-api">
##Theme
The theme determines the routes, controller names, views and supporting files (e.g, css)

methods:

 - *app.theme.name* - The name of the theme
 - *app.theme.version* - Version of the theme
 - *app.theme.path* - Path to the root of the theme's folder to include images and elements from theme's folder
 - *app.theme.routes* - Array of defined routes provided from theme's config
 - *app.theme.view(viewname)* - Function that returns full path to view including '.html'
</section>
<section id="plugins-api">
##Plugins
Plugins are nothing more that standard JS file(s) that can be loaded into the app from the `config.js`. Learn how to [package files into a plugin][create-plugins] for easy loading.

Information for loaded plugins is in `app.plugins`. The `app.plugins` object contains a list of the loaded plugins which have information on themselves.

Output from `app.plugins['Angular']` results in:

	{
		"name": "Angular",
		"version": "1.2.4",
		 "files": [
			"angular.js",
			"angular-animate.js",
			"angular-cookies.js",
			"angular-csp.css",
			"angular-loader.js",
			"angular-resource.js",
			"angular-route.js",
			"angular-sanitize.js",
			"angular-scenario.js",
			"angular-touch.js"
		],
		"angularMod": [
			"ngAnimate",
			"ngCookies",
			"ngTouch",
			"ngResource",
			"ngRoute",
			"ngSanitize",
			"ngLocale",
			"ngTouch"
		]
	}
</section>
<section id="collection-api">
##Collection
The collection API allows developers to easily view and manipulate data stored in their Plus.io Google App Engine backend.

To use this api, projectId and serverSecret must be set in config.js

	{
		projectId: "the-hungry-llama",
		serverSecret: "yourSuperSerectPassphrase"
	}
	
This api is accessible on the global plus object.
methods:

 - plus.collection.get(collection [, id], success[, error]);

		plus.collection.get('users', 3452345345, function(user){
			console.log(user.id); //3452345345
		});
 - plus.collection.add(collection, data[, success, error]);
 		
		plus.collection.add('users', {
			email: 'user@name.com',
			name : 'Joe Smith'
		}, success, error);
 - plus.collection.update(collection, id, data[, success, error]);
		
		plus.collection.update('users', 3452345345, {
			name: 'John Smith'
		}, success, error);
		
 - plus.collection.delete(collection, id[, success, error]);
 
 		plus.collection.delete('users', 3452345345, function(){
 			// poof!
 		});
 - plus.collection.structure([collection, success, error]);
 
 	This function returns the fields that are in a collection data, and the total number of items in that collection. If this function is called without a collection, it will return the  names of the collections.
 	
 		plus.collection.structure(function(data){
 			
 			console.log(data); // { 0: 'users'}
 			
 			plus.collection.structure(data[0], function(userCollection){
 				console.log(userCollection);
 				/*
 					[
 						{
 							0: 'name',
 							1: 'id
 						},
 						{ count: 1 }
 					]
 				*/
 			})
 		});
</section>
<section id="geo">
##Geo
</section>
<section id="development">
##Development environment
</section>

[development]: #development
[repo]: https://github.com/plusio/frontend.git
[getting-started]: #getting-started
[same-origin]: #disable-same-origin
[theme-js]:#theme-js
[creating-controllers]: #create-controllers
[create-new-app]: #create-new-app
[add-plugins]: #add-plugins
[create-plugins]: #create-plugins
[api-link]: #apis
[app-api]: #app-api
[page-api]: #page-api
[theme-api]: #theme-api
[plugins-api]: #plugins-api
[collection-api]: #collection-api
[route-link]: #theme-route
[mamp-link]: http://www.mamp.info/en/index.html
[xampp-link]: http://www.apachefriends.org/index.html
[force-cors]: https://addons.mozilla.org/en-US/firefox/addon/forcecors/reviews/
[angular-route]: http://docs.angularjs.org/api/ngRoute.$route
[angular-docs]: 
[angular-scope]: