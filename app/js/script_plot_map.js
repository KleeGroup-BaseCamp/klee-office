/////////////////////////////
// plot tables
/////////////////////////////

(function(window){
	// get vars
	var buttonN2 = document.querySelector('#N2'),
		buttonN3 = document.querySelector('#N3'),
		existMap = false,
		mapName = null;

	// register click class
	// ------------------------------
	// sloved; problem here, one click will block other clicks
	//-------------------------------
	buttonN2.addEventListener("click", function () {
		// if no map, show mapN2
		if (!existMap) {
			mapName = "N2";
			map(mapName);
			existMap = true;
		}
		// if other map, delete and show mapN2
		else if (mapName !== "N2") {
			d3.select(".map").select("svg").remove();
			mapName = "N2";
			map(mapName);
		}
	});
	buttonN3.addEventListener("click", function () {
		// if no map, show mapN3
		if (!existMap) {
			mapName = "N3";
			map(mapName);
			existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapName !== "N3") {
			d3.select(".map").select("svg").remove();
			mapName = "N3";
			map(mapName);
		}
	});
}(window));
/////////////////////////////
// import map from "/maps/"
/////////////////////////////
"use strict";

function map(name) {
	d3.xml("http://localhost:8080/maps/" + name + ".svg", 
	function(error, documentFragment) {
		var svgNode,
			map;

		svgNode = documentFragment.getElementsByTagName("svg")[0];
		map = d3.select(".map");
		map.node().appendChild(svgNode);

		/////////////////////////////
		// Version 1: for each people, search his table
		/////////////////////////////

		d3.json("http://localhost:8080/people", function(error, data) {

			/////////////////////////////
			// add names to each table
			/////////////////////////////
			var dataset = data,
				table,
				oldColor,
				// Define the div for the tooltip
				div = d3.select("#main").select(".tooltip")
						.style("opacity", 0);

			console.log(dataset);
			
			dataset.forEach(function(d, i) {
				d.tableID = +d.tableID;
				table = d3.select("#table"+d.tableID);
				if(table[0][0] !== null){
					table.select("rect").attr("id", d.firstName);

				// mouse hover on the text will give more info
				table.on("mouseover", function() {
					oldColor = d3.select(this).select("rect")
								.attr("fill");
					d3.select(this).select("rect")
						.transition()
						.duration(200)
						.attr("fill", "red");

					div.transition()
						.duration(200)
						.style("opacity", .9);
					div .html("name: " + d.name + "<br/>"
								+ "email: " + d.email)
						.style("left", (d3.event.pageX + 16) + "px")
						.style("top", (d3.event.pageY + 16) + "px");
				});

				table.on("mouseout", function() {
					d3.select(this).select("rect")
						.transition()
						.duration(200)
						.attr("fill", oldColor);

					div.transition()
						.duration(500)
						.style("opacity", 0);
				});	
				}
			});
		});
});
}

