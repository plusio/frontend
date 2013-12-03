$app.controller('home', function($scope, plusCollection){
	$scope.pageLoaded = function(){
		$('h1').css('color', '#0090d6');
	}

	function updateScope(){
		plusCollection.get('test', function(data){
			$scope.books = data;
		});
	}

	$scope.remove = function(){
		plusCollection.delete('test', $scope.books[0].id, updateScope);
	}

	$scope.add = function(){
		plusCollection.post('test', { test_key: 'value'}, updateScope);
	}

	$scope.update = function(){
		plusCollection.update('test', $scope.books[0].id, {updated : 'true'}, updateScope);
	}

	updateScope();
});