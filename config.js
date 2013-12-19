/*
 * plugins are loaded in the order specified here.
 * If loading jQuery, it must come before Angular.
 */
var app = {
	name : 'Plus.io Frontend',
	plugins : ['jquery', "angular", "plus", 'hammer', 'overthrow'],
	theme : 'hello-world',
	projectId : "revision-3",
	serverSecret : "529d113f67c4e8ee215e"
}