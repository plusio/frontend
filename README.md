#Plus.io Frontend
The Front-end for plus.io allows developers and designers to quickly create mobile app's using plugins, themes, and plus.io's backend interface.

##Installation Prerequisites
###Web server

Any web server should work. An easy, no setup web server for Mac OSX, Linux & Windows would be XAMPP.

###Modern Web Browser

Webkit based browsers (Safari/Chrome) recommended.

##Installation

Download the plus.io front-end and place into your server’s htdocs folder. Then navigate to that directory in your browser and you should see the default app.

##Configuration

In the app folder there is a config.json file which contains all of the configuration options for your app. here is an example of an empty config file.

	{
		"name" : "",
		"google_id" : "",
		"google_secret" : "",
		"google_scope" : "",
		"google_redirect" : "",
		"server_url" : "",
		"server_secret"" : "",
		"environment" : "",

		"theme" : "",

		"restEntities" : [""],
		"syncLoopDelay" : 600000,
		"data_sync": true,

		"plugins" : [],
		"scripts" : []
	}
	
- name : Your applications name.
- google_id : your google api console client id.
- google_secret : your google api console client secret key.
- google_scope : scopes to request user information when a user log's in through your app. note: that the userinfo.email scope is called already by plus.io
- google_redirect : is the redirect url after a user logs in, and needs to match the entry it your google api console, and must be the url to your application. i.e.: if your app is in htdocs/plus, then the redirect url will be http://locahost/plus/ (This option **does not** need be changed when deploying to mobile)
- server_url : the url to the your api's endpoint. i.e.: https://[yourapp].appspot.com/
- server_secret : the secret key to be passed in as a URL parameter
- environment : either development or production, current suppresses warning messages while in production
- theme : the name of theme to use, must match the theme's folder name.
- restEntitites : the names of the collections for data sync to monitor.
- syncLoopDelay : how often, in milliseconds, to run data sync.
- data_sync : true or false, wether or not data sync should run.
- plugins : an array of plugins to include in the app, the names need to match the plugin's folder title.
- scripts : any custom scripts to load into the app (i.e.: controllers), relative from app/includes/scripts/. note: you **do not** need to specify the .js file extension here.

##Rest API

The api provides methods to get and send data to your plus.io backend, built into the api is a sync service that will automatically attempt to re-post data that was not successfully sent for any number of reasons.

To set up the sync, find `restEntities` in your app’s config.json, this is an array of collection titles that you would like to data to attempt to re-send when a post fails, most likely because of a lack of internet connection. Secondly is `syncLoopDelay` which is an integer of milliseconds for how often the data should attempt to re-sync. The default is 10 minutes, and cannot be less than 10 seconds.

###API reference:
`plus.collection.structure`

`plus.collection.get`

`plus.collection.add`

`plus.collection.update`

`plus.collection.delete`

**For the Examples below we will use 'foo' as a collection name**

####Structure
`plus.collection.structure(collection_name)`

This returns an array with two objects of metadata. The first object contains the keys for the collection, the second contains ‘count’ which is the total number of objects in the collection.

`plus.collection.structure("foo");`
returns:

	[{
		0: "id",
		1: "name",
		2: "time"
	},
	{
		count: 497
	}]

####Getting Data
`plus.collection.get (collection_name[, filter]);`

This function takes the name of a collection and optionally a filter, a filter can be either an Integer which will return the object with that id, or the filter can be an object with the options specified below.

`plus.collection.get(‘foo’);`
returns:

	[{
		“id” : 20043,
        "name" : "bar",
        "time" : "1372790420482"
	},
	{...}
	]	
	
#####Getting one record by id
`plus.collection.get(‘foo’, 10011);`
returns:

	{
        "name" : "baz",
        "time" : "1372790420482"
	}
	
#####Using a filter
        
**filter options:**
- limit (Integer) - the api will return this number of records
- offset (Integer) - the number of records to omit from 0;
- filter (String) - A key within the objects in the collection to search by
- value (String) - the value to search with, this must match the filter's value exactly

`plus.collection.get('foo', { limit : 50, offset : 150 });` will return up to 50 results skipping the first 150 objects in the collection, you can use any of the options together, where only the `filter` and `value` options to required to be together.

if the `limit` and `offset` options are not specified the api defaults to a limit of `20` and an offset of `0`.

####Adding Data
`plus.collection.add(collection_name, data);`
 
This function adds a record to the plus.io collection specified. The time of the function call will be added to the data automatically and sent to the collection to represent the created time.

`plus.collection.add('foo', { name : 'barbaz' })`

returns:

	{
		name : 'barbaz',
		time : '1372790420482',
		id	: 20010
	}
####Updating Data
`plus.collection.update(collection_name, id, data)`

This function updates a record with the id in the collection specified.

`plus.collection.update('foo', 20010, { name : 'foobar', modified_time : new Date().getTime() });` 

returns:
	
	{
		name : 'foobar',
		time : '1372790420482',
		modified_time : 1372792616943,
		id : 20010
	}
####Deleting Data

`plus.collection.delete(collection_name, id);`

This function deletes the record with the specified id in the specified collection.

`plus.collection.delete('foo', 20010);`

####Callbacks
To provide a callback function to run when the api returns data simply chain `.then(fn)` to the end of any of the above functions and pass in `data` where data will be equal to the data returned from the api.
```javascript
plus.collection.get('foo').then(function(data){
	$scope.records = data;
});
```
**Note**:
While developing on `localhost` you may experience 405 errors (Cross Origin Domain errors) while posting data. This is because the browser security will not allow localhost to post to servers, this can be circumvented by disabling the security in the browser. This is only necessary on localhost, deploying to a mobile app will function as expected.

For Chrome run your OS's respective command in the terminal or command prompt:

**Mac** : `open -a Google\ Chrome –args –disable-web-security`

**Windows** : `chrome.exe –disable-web-security`

**Linux** : `google-chrome –disable-web-security`

Make sure that all browser windows are closed, or else chrome will not re-start with security disabled.

##Maps
Insert mapping docs here.

##Themes
Themes in plus.io Front-end are HTML and CSS, and can optionally contain Javascript depending on complexity.

The folder layout represented by the twentythirteen theme is as follows:

	/twentythirteen
		twentythirteen.json
		css/
			bootstrap.css
			style.css
		img/
			glyphicons-halflings.png
			(...)
		js/
			theme-controllers.js
		views/
			list.tpl.html
			home.tpl.html
			map.tpl.html
			(...)
		
Only the `[themename].json` is required as well as the `views` folder, the rest are optional and can be titled however you like as these are specified in the theme's json (configuration) file.

###Theme configuration
The configuration file must be the same name as your theme, matching the folder name, with the .json file extension.

####config options
	{
		"title" : "",
		"author" : "",
		"files" : {
			"css"  : [],
			"js" : []
		},
		"routes" : [
			{
				"path" : "",
				"layout" : "",
				"template" : "",
				"controller" : "",
				"title" : "",
				"class" : ""
			},
			{
				"otherwise" : "",
			}	
		]
	}
	
- title : The display (Human readable) title of your theme
- author : Who created the theme
- files : An object with the paths to the files included with your theme.
	- css : an array of paths, relative from the theme folder, to your css files relative from the root of your theme, you **do not** need to include the .css file extension here.
	- js : an array of paths, relative from the theme folder, to your js files relative form the root of your theme, you **do not** need to include the .js file extension here.
- routes : An array of objects containing options for their route.
	- path : The url path relative from the root of the application's directory.
	- layout : The path to a layout relative from the theme's views folder.
	- template : The path to a template relative from the theme's views folder.
	- controller : the name of the controller for this route.
	- title : used as the link text when using the `<plus-menu>` html tag to dyanicly generate a navigation menu.
	- class : A css class that will be applied to the `<li>` in the navigation generated by `<plus-menu>`.
	- otherwise : can be specified in it's own object to tell the application which route to redirect to when an unspecified path is navigated to. This should point to the initial page in your app, as this option will load the first page when the app has be deployed to a mobile phone.
	
####Views

Views are html and can be either a layout, a template, or a partial.

 - **Layouts** are files that can be used os more than one page, i.e. this can contain a header and footer and can be used in several routes. Tip: use `<plus-template />` to include the template specified in the theme's config on a per route basis.
 - **Templates** contain the html unique to and individual page, and are intended to be used for one route.
 - **Partials** are useful to include the same html into multiple views. A good example would a theme that has multiple page layouts but they all still have headers, instead of copying the header's html into multiple files, the header can be in a partial and the partial will be loaded multiple times in different files. Tip: use `<div ng-include="/path/to/partial"></div>` to bring in html partials
 
 While all the views can be placed into the views folder, it is recommended to place your layout files in a layouts folder inside the views folder, and assuming all partials will be included in layouts they can be placed into the layouts folder prefixed with an underscore `_partial.tpl.html` or into their own partials folder. 


##Plugins
This is where you can simply drop-in new features & functionality. These are self contained bundles of functionality. 
Installing a plugin
Step 1. Copy the plugin folder into the app/plugins folder.
Step 2. Add the plugin folder name to the “plugins” json key in the application configuration file. 
         * plugins add to the functionality of Plus.io Frontend
         */
        "plugins" : ["leaflet"],
The example above shows how to add mapping features to your application by using a leaflet plugin simply by dropping in the leaflet plugin folder into the app/plugins folder.


##Elements
These are code snippets that can be shared with many different applications & themes. Anything you use short code snippets for, you can use elements for. It can represent very small bits of javascript and / or html. Anyone could create styled list items, cover flow functionality, Metro UI style selections, etc.  
How to create an element:
Step 1. Create an html file in the app/elements folder.
Step 2. Add the code snippet you wish to use (html/css and or javascript). One example would be of a code snippet that would create a unorder list such as the “loop” element below.

Step 3: Use the ng-include tag and specify the name of the element as shown in the code snippet below:

<ng-include src="app.paths.element('loop')"></ng-include>     
This 1 line of html below is all a designer or developer would need in order to create a list that loops through all the records of a collection and styles.: