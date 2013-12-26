ThemeConfig({
	name : 'Hello World',
	version : '1.0',
	files : [
		'css/bootstrap.css',
		'css/style.css'
	],
	routes : [
		'home',
		'items',
		{
			route : 'items/books',
			view : 'items'
		}, 
		'items/:id'
	]
});
