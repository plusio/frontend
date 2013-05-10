/*
 * This is an example of a controller provided by the theme
 */

$app.controller('pagesList', function ($scope, $routeParams, setPageTitle) {
	$scope.employees = [
		{
			name : 'AJ Rahim',
			position : 'Something',
			content : 'aj'
		},
		{
			name : 'Cameron Gallarno',
			position : 'Something',
			content : 'cameron'
		},
		{
			name : 'Andy Nunez',
			position : 'Something',
			content : 'andy'
		},
		{
			name : 'Badia Daamash',
			position : 'Something',
			content : 'badia'
		}
	 ];
});
