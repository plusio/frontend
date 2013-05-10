/*
 * Disable 'elastic scrolling' on ios to make your webapp feel more a native.
 * This javascript soulution is for ios devices,
 * look at style.css for OSX Lion solution.
 *
 * http://www.smilingsouls.net/Blog/20110804114957.html
 */
head.ready(function(){
	/*
	 * Use head.ready() to wait untill all files have been loaded, and the dom is loaded to execute javascript
	 */
	document.addEventListener('touchmove', function(e) {
	    e.preventDefault();
	  }, false
	);
});