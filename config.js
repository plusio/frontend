/*
 * plugins are loaded in the order specified here.
 * If loading jQuery, it must come before Angular.
 */
var app = {
	title : 'Plus.io Frontend',
	plugins : ["angular", "plus", 'hammer', 'overthrow'],
	theme : 'starter',
	projectId : "revision-3",
	serverSecret : "529d113f67c4e8ee215e"
}