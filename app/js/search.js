/* ------------------------------------------------------------ *\
|* ------------------------------------------------------------ *|
|* Some JS to help with our search
|* ------------------------------------------------------------ *|
\* ------------------------------------------------------------ */
'use strict';
function search(val) {
	return d3.select("#layer1").select("#" + val);
}

// set all tables to their default colors
'use strict';
function setDefault() {
	var allemagne,
		angleterre,
		france,
		office;

	allemagne = d3.select("#layer1").select("#allemagne").selectAll("rect");
	allemagne.attr("fill", "#ccff00");

	angleterre = d3.select("#layer1").select("#angleterre").selectAll("rect");
	angleterre.attr("fill", "#68dd55");

	france = d3.select("#layer1").select("#france").selectAll("rect");
	france.attr("fill", "#ffff00");

	office = d3.select("#layer1").select(".office").selectAll("rect");
	office.attr("fill", "#18b4ff");

	return;
}

(function(window){

	// get vars
	var searchEl = document.querySelector("#input");
	var labelEl = document.querySelector("#label");

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
		var clickedID = e.target.id;
		if (clickedID !== "search-terms" && clickedID !== "search-label") {
			if (classie.has(searchEl,"focus")) {
				classie.remove(searchEl,"focus");
				classie.remove(labelEl,"active");
			}
		}
	});

	// search input strings
	d3.select("#input")
		.on("keyup", function() {
			var name,
				table;

			console.log(document.getElementById("search-terms").value);
			name = (document.getElementById("search-terms").value);
			table = search(name);
			if(table[0][0]) {
				table.attr("fill", "red");
			}
			else{
				setDefault();
			}
	});

}(window));
