/* ------------------------------------------------------------ *\
|* ------------------------------------------------------------ *|
|* moniter click events, control search bar toggle action
|* ------------------------------------------------------------ *|
\* ------------------------------------------------------------ */
// set all tables to their default colors
'use strict';

(function(window){

	// get vars
	var messageEl = document.querySelector('#message');

	// register clicks outisde search box, and toggle correct classes
	document.addEventListener("click",function(e){
		var clickedID = e.target.id,
			clickedClass = $(e.target).attr('class');

		// if click over search bar or autocomplete list, do nothing
		if (clickedID == "home-title") {
			if (classie.has(messageEl,"focus")) {
				classie.remove(messageEl, "focus");
			}
		}
	});

}(window));
