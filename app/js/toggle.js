/* ------------------------------------------------------------ *\
|* ------------------------------------------------------------ *|
|* moniter click events, control search bar toggle action
|* ------------------------------------------------------------ *|
\* ------------------------------------------------------------ */
// set all tables to their default colors
'use strict';

(function(window){

	// get vars
	var searchEl = document.querySelector("#input");
	var labelEl = document.querySelector("#label");
	var messageEl = document.querySelector('#message');

	// register clicks and toggle classes
	labelEl.addEventListener("click",function(){
		if (classie.has(searchEl,"focus")) {
			classie.remove(searchEl,"focus");
			classie.remove(labelEl,"active");
		} else {
			classie.add(searchEl,"focus");
			classie.add(labelEl,"active");
		}
	});

	// register clicks outisde search box, and toggle correct classes
	document.addEventListener("click",function(e){
		var clickedID = e.target.id,
			clickedClass = $(e.target).attr('class');

		// if click over search bar or autocomplete list, do nothing
		if (clickedID !== "search-terms" && clickedID !== "search-label"
			&& clickedClass !== "autocomplete-suggestion autocomplete-selected"
			&& clickedClass !== "autocomplete-suggestion") {
			if (classie.has(searchEl,"focus")) {
				classie.remove(searchEl,"focus");
				classie.remove(labelEl,"active");
				classie.remove(messageEl, "focus");
			}
		}
	});

}(window));
