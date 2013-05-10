//'use strict';

$app.directive('stickyNote', function(socket) {
	var linker;// = function(scope, element, attrs) {
			// element.draggable({
			// 	stop: function(event, ui) {
			// 		socket.emit('moveNote', {
			// 			id: scope.note.id,
			// 			x: ui.position.left,
			// 			y: ui.position.top
			// 		});
			// 	}
			// });

			// socket.on('onNoteMoved', function(data) {
			// 	// Update if the same note
			// 	if(data.id == scope.note.id) {
			// 		element.animate({
			// 			left: data.x,
			// 			top: data.y
			// 		});
			// 	}
			// });

			// // Some DOM initiation to make it nice
			// element.css('left', '10px');
			// element.css('top', '50px');
			// element.hide().fadeIn();
		//};

	var controller = function($scope) {
			//$scope.eventFn = "alert('hi');";
			// Incoming
			socket.on('onNoteUpdated', function(data) {
				// Update if the same note
				if(data.id == $scope.note.id) {
					$scope.note.title = data.title;
					$scope.note.body = data.body;
				}				
			});

		  socket.on('onGlassEvent', function(data){
	          console.log('Glass event recieved: ', data.fn);
	          // Doesn't work despite documentation that suggests this is the way to go.
	          //$scope.$eval($scope.eventFn);

	          // Does work despite documentation saying it won't...  watch out for funny behavior later tho.
	         // eval(data.fn);
	          $scope.$eval(data.fn);
	          console.log(typeof data.fn);
	      });	

			// Outgoing
			$scope.updateNote = function(note) {
				socket.emit('updateNote', note);
			};

			$scope.deleteNote = function(id) {
				$scope.ondelete({
					id: id
				});
			};

			$scope.mobileEvent = function(content){
				//$scope.onMobileEvent( {message: content} );
				//console.log('attempting to send from directive:', content);
				socket.emit('mobileEvent', {message: content});
			}
		};

	return {
		restrict: 'A',
		link: linker,
		controller: controller,
		scope: {
			note: '=',
			ondelete: '&'
		}
	};
});

//'use strict';

// $app.directive('sockjs-tag', function(sockjs) {
// 	var linker;
// 	var controller = function($scope) {
// 			// Incoming
// 			sockjs.onmessage(e) {
// 				console.log('Glass event recieved:', e.data);			
// 			};
// 			 // sock.onmessage = function(e) {
// 	         // $scope.messages.push(e.data);
// 	         // $scope.$apply();

// 	        // Outgoing
// 	        sockjs.send(e){
// 	        	console.log('this is being sent:', e);
// 	        }
// 		};

// 	return {
// 		restrict: 'A',
// 		link: linker,
// 		controller: controller,
// 		scope: {
// 			note: '=',
// 			ondelete: '&'
// 		}
// 	};
// });