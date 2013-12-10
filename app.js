$app.controller('home', function($scope, plusCollection){
	$scope.pageLoaded = function(){
		$('h1').css('color', '#0090d6');
	}

	function updateScope(){
		console.log('updating scope');
		plusCollection.get('test',function(data){
			$scope.books = data;
			plusCollection.get('test', { limit : 1, test_key:'value', myKey : 'sdf' }, function(data){
				$scope.first = data;
			});
		}, function(a, b, c, d){
			console.log('get Error callback');
			console.log(a, b, c, d);
		});
	}

	$scope.remove = function(){
		plusCollection.delete('test', $scope.books[0].id, updateScope);
	}

	$scope.add = function(){
		plusCollection.add('test', { test_key: 'newvalue', offset : 'three', _two : 2}, updateScope);
	}

	$scope.update = function(){
		plusCollection.update('test', $scope.books[0].id, {updated : 'true'}, updateScope);
	}

	updateScope();
});