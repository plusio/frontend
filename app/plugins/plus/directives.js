'use strict';

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