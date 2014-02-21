ThemeConfig({
	name : 'Hello World',
	version : '1.0',
	files : [
		'css/bootstrap.css',
		'fonts/roboto/stylesheet.css',
		'css/style.css'
	],
	routes : [
		'home',
		'no-view',
		{
			route : 'layout',
			layout: 'myLayout'
		}
	]
});
