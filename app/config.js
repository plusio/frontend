var appConfig = 
{
	"name" : "",
	"id" : "4fdab4a1d645c6c75e000001", // app key
	"environment" : "development", // development / production

	/*
	 * Specify the name of the selected theme
	 */
	"themes" : ['bootstrap'],

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
	 * or rename these files to something other than the default.
	 */
	"scripts" : [
		'controllers',
		'services',
		'filters',
		'directives'
	]
}