var appConfig = 
{
	"name" : "",
	"id" : "", // app key
	"environment" : "development", // development / production

	/*
	 * Specify the name of the selected theme
	 */
	"themes" : ['twentythirteen'],

	/*
	 * plugins add to the functionality of Tyto
	 */
	"plugins" : [
		"gestures",
		"iscroll",
		"plus",
		"leaflet"
	],

	/*
	 * You shouldn't need to change these unless you split your functions into multiple files
	 * or rename these files to something other than the default
	 */
	"scripts" : [
		'controllers',
		'services',
		'filters',
		'directives'
	],

	/*
	 * all system functionality is included by default but you can choose to not include each module individually
	 */
	"system" : [
		"directives/tyto-compile",
		"directives/tyto-pages",
		"directives/tyto-table",
		"directives/tyto-template",
		"directives/tyto-menu",
		"directives/tyto-resize"
	]
}