/////////////////////////////
// plot tables
/////////////////////////////

(function(window){
	// get vars
	var buttonN0 = document.querySelector('#N0'),
		buttonN1 = document.querySelector('#N1'),
		buttonN2 = document.querySelector('#N2'),
		buttonN3 = document.querySelector('#N3'),
		buttonN4 = document.querySelector('#N4'),
		buttonO2 = document.querySelector('#O2'),
		buttonO3 = document.querySelector('#O3'),
		buttonO4 = document.querySelector('#O4'),
		existMap = false,
		mapName = null;

	// register click class
	// ------------------------------
	// sloved; problem here, one click will block other clicks
	//-------------------------------
	buttonN0.addEventListener("click", function () {
		// if no map, show mapN2
		if (!existMap) {
			mapName = "N0";
			map(mapName);
			existMap = true;
		}
		// if other map, delete and show mapN2
		else if (mapName !== "N0") {
			d3.select(".map").select("svg").remove();
			mapName = "N0";
			map(mapName);
		}
	});
	buttonN1.addEventListener("click", function () {
		// if no map, show mapN2
		if (!existMap) {
			mapName = "N1";
			map(mapName);
			existMap = true;
		}
		// if other map, delete and show mapN2
		else if (mapName !== "N1") {
			d3.select(".map").select("svg").remove();
			mapName = "N1";
			map(mapName);
		}
	});
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
	buttonN4.addEventListener("click", function () {
		// if no map, show mapN3
		if (!existMap) {
			mapName = "N4";
			map(mapName);
			existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapName !== "N4") {
			d3.select(".map").select("svg").remove();
			mapName = "N4";
			map(mapName);
		}
	});
	buttonO2.addEventListener("click", function () {
		// if no map, show mapN3
		if (!existMap) {
			mapName = "O2";
			map(mapName);
			existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapName !== "O2") {
			d3.select(".map").select("svg").remove();
			mapName = "O2";
			map(mapName);
		}
	});
	buttonO3.addEventListener("click", function () {
		// if no map, show mapN3
		if (!existMap) {
			mapName = "O3";
			map(mapName);
			existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapName !== "O3") {
			d3.select(".map").select("svg").remove();
			mapName = "O3";
			map(mapName);
		}
	});
	buttonO4.addEventListener("click", function () {
		// if no map, show mapN3
		if (!existMap) {
			mapName = "O4";
			map(mapName);
			existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapName !== "O4") {
			d3.select(".map").select("svg").remove();
			mapName = "O4";
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
			map,
			floorName,
			allTables,
			allAvailables;

		svgNode = documentFragment.getElementsByTagName("svg")[0];
		map = d3.select(".map");
		map.node().appendChild(svgNode);
		floorName = name;

		// mark all tables as available
		allTables = d3.select("#tables").selectAll("g");
		allTables.attr("class", "available");
		/////////////////////////////
		// for each people, search his table
		/////////////////////////////
		d3.json("http://localhost:8080/people", function(error, data) {
			/////////////////////////////
			// add names to each table
			/////////////////////////////
			var dataset = data,
				table,
				// Define the div for the tooltip
				div = d3.select("#main").select(".tooltip")
						.style("opacity", 0);
			
			dataset.forEach(function(d, i) {
				// split tableID into two parts.
				// ex "La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"]
				var splitID = d.tableID.split(/\s+:\s+/);

				// do following if we have the second part
				if(splitID[1]){
					table = d3.select("#"+splitID[1]);
					// if found in map, change table color, add hover actions
					if(table[0][0] !== null){
						// mark as occupied
						table.attr("class", "occupied");
						table.select("rect")
						     .attr("id", d.cn)
							 .attr("fill", "#ff9900");

						// mouse hover on the text will give more info
						table.on("mouseover", function() {
							div.transition()
								.duration(200)
								.style("opacity", .9);
							div .html("name: " + d.cn + "<br/>"
										+ "email: " + d.mail)
								.style("left", (d3.event.pageX + 16) + "px")
								.style("top", (d3.event.pageY + 16) + "px");
						});
						table.on("mouseout", function() {
							div.transition()
								.duration(500)
								.style("opacity", 0);
						});	
					}
				}
			});

			////////////////////////////////
			// show all available tables
			////////////////////////////////
			allAvailables = d3.select("#tables").selectAll(".available");
			allAvailables.selectAll("rect").attr("fill", "#00cc00");
			allAvailables.on("mouseover", function() {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html("pas de personne" + "<br/>" + "ce bureau est disponible")
					.style("left", (d3.event.pageX + 16) + "px")
					.style("top", (d3.event.pageY + 16) + "px");
			});
			allAvailables.on("mouseout", function() {
				div.transition()
					.duration(500)
					.style("opacity", 0);
			});
		});

});
}

