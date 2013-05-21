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
	"plugins" : ['plus', 'leaflet'],

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