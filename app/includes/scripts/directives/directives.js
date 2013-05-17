'use strict';

/* Directives */
/*
	The purpose of directives is essentially teach html "new tricks". 
	Most jquery style effects, DOM manipulation, any interactions with js plugins on html belongs in this file.
	Attempting other approaches will often be unnecessarily frustrating otherwise.
	For further help on directives take a long at these articles:
	1) http://www.yearofmoo.com/2012/08/use-angularjs-to-power-your-web-application.html#directives
	2) http://blog.artlogic.com/2013/03/06/angularjs-for-jquery-developers/
*/

/*
	Variables:
	1) myDirective - name of the directive can be used in 3 ways.
		As of this writing there are 5 ways to specify a directive. See angularjs docs for more info: http://docs.angularjs.org/guide/directive
	2) 
*/

$app.directive('myDirective',function($compile) {
  return {
    templateUrl : '/path/to/some/template.html', //(optional) the contents of this template can be downloaded and constructed into the element
    replace : true, //whether or not to replace the inner data within the element
    link : function($scope, $element, attributes) { //this is where your magic happens, meaning programmatic logic can be done here within the directive.
      $scope.title = '...';
    }
  };
});