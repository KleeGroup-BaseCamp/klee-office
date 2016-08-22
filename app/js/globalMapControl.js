"use strict";
// global variables
var	server= "http://local-map/"

var mapControl = {
	existMap: false,
	mapName: null,
	mapPlot: 
		function(name, callback) {
			// add svg map to html

			d3.select("#map-show")
				.style("visibility", "visible")
				.style("width", "100%")
				.style("height", "100%");

			d3.xml( server + "maps/" + name + ".svg", 
			function(error, documentFragment) {
				if(error){
					console.log(error);
					return;
				}

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
				d3.json( server+"people", function(error, data) {
					/////////////////////////////
					// add names to each table
					/////////////////////////////
					var dataset = data,
						table,
						// Define the div for the tooltip
						div = d3.select("#main").select(".tooltip")
								.style("opacity", 0);
					
					dataset.forEach(function(data, i) {
						// data example: ["CN=Laurence EYRAUD-JOLY,OU=Klee SA,OU=Utilisateurs,DC=KLEE,DC=LAN,DC=NET", 
						//					{ "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }]
						// only need data[1]
						var d = data[1];
						// split tableID into two parts.
						// ex "La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"]

						if (d.physicalDeliveryOfficeName) {
							var splitID = d.physicalDeliveryOfficeName[0].split(/\s+:\s+/);

							// do following if we have the second part
							if(splitID[1]){
								table = d3.select("#"+splitID[1]);
								// if found in map, change table color, add hover actions
								if(table[0][0] !== null){
									// mark as occupied
									table.attr("class", "occupied");
									table.select("rect")
									     .attr("id", d.cn[0])
										 .attr("fill", "#ff9900");

									// mouse hover on the text will give more info
									table.on("mouseover", function() {
										div.transition()
											.duration(200)
											.style("opacity", .9);
										div .html(d.cn[0] + "<br/>"
													+ "email: " + d.mail[0])
											.style("left", (d3.event.pageX + 16) + "px")
											.style("top", (d3.event.pageY + 16) + "px")
											.style("height", "40px");
									});
									table.on("mouseout", function() {
										div.transition()
											.duration(500)
											.style("opacity", 0);
									});	
								}
							}
						}
					});

					////////////////////////////////
					// show all available tables
					////////////////////////////////
					allAvailables = d3.select("#tables").selectAll(".available");
					allAvailables.selectAll("rect").attr("fill", "#99ff99");
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

					callback();
				});
			});
		},
	smallMapPlot:
		function(name, callback) {
			var longTooltip = [];

			d3.select("#navigation-chart")
				.style("visibility", "visible")
				.style("width", "100%")
				.style("height", "100%");

			d3.select("#map-show")
				.style("visibility", "hidden")
				.style("width", "0px")
				.style("height", "0px");

			d3.xml( server + "maps/" + name + ".svg",
				function(error, documentFragment) {
					if(error){
						console.log(error);
						return;
					}

					var svgNode,
						map,
						allTables,
						allAvailables;

					svgNode = documentFragment.getElementsByTagName("svg")[0];

					map = document.getElementById("svg-"+name);
					map.appendChild(svgNode);

					// mark all tables as available
					allTables = d3.select("#tables").selectAll("g");
					allTables.attr("class", "available");
					/////////////////////////////
					// for each people, search his table
					/////////////////////////////
					d3.json( server+"people", function(error, data) {
						/////////////////////////////
						// add names to each table
						/////////////////////////////
						var dataset = data,
							table;

						dataset.forEach(function(data, i) {
							// data example: ["CN=Laurence EYRAUD-JOLY,OU=Klee SA,OU=Utilisateurs,DC=KLEE,DC=LAN,DC=NET",
							//					{ "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }]
							// only need data[1]
							var d = data[1];
							// split tableID into two parts.
							// ex "La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"]

							if (d.physicalDeliveryOfficeName) {
								var splitID = d.physicalDeliveryOfficeName[0].split(/\s+:\s+/);

								// do following if we have the second part
								if(splitID[1]){
									table = d3.select("#"+splitID[1]);
									// if found in map, change table color, add hover actions
									if(table[0][0] !== null){
										// mark as occupied
										table.attr("class", "occupied");
										table.select("rect")
											.attr("id", d.cn[0])
											.attr("fill", "#ff9900");
									}
								}
							}
						});

						////////////////////////////////
						// show all available tables
						////////////////////////////////
						allAvailables = d3.select("#tables").selectAll(".available");
						allAvailables.selectAll("rect").attr("fill", "#99ff99");
						callback();
					});
				});
		},
	buildTooltips: function(names){

		names.forEach(function(element){

			/*
			 * get the departments in one map
			 */
			console.log(element);
			d3.xml(server + "maps/" + element + ".svg",
				function(error, documentFragment) {
					if(error){
						console.log("error at " + element + " " + error);
						return;
					}
					d3.json(server + "people/	", function(error, data) {

						var dataset = data;
						var departmentNames = [];
						var tooltip = "";

						// for each mapName, we will produce the tooltip
						// containing the main departments situated in this floor
						dataset.forEach(function(data, i) {
							// data example: ["CN=Laurence EYRAUD-JOLY,OU=Klee SA,OU=Utilisateurs,DC=KLEE,DC=LAN,DC=NET",
							//					{ "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }]

							// get main departments in this floor
							var d0 = data[0].split(",");
							var departmentName = d0[1].split("=");

							var d = data[1];
							if (d.physicalDeliveryOfficeName) {
								var splitID = d.physicalDeliveryOfficeName[0].split(/\s+:\s+/);
								if(splitID[1]){
									var floor = splitID[1].split("-")[0];
									if(floor == element){
										if($.inArray(departmentName[1], departmentNames)<0){
											// add department name in the array
											departmentNames.push(departmentName[1]);
										}
									}
								}
							}
						});
						/*
						 * build the associated tooltip string
						 * if array not empty
						 */
						if(departmentNames !== undefined && departmentNames.length > 0){
							departmentNames.forEach(function(name){
								if(name !== null && name !== undefined && name !== ""){
										tooltip += "<li>" + name + "</li>";
								}
							});
						}
						else {
							tooltip = "No data for this floor.";
						}

						/*
						 * create the tooltip object with mouseonver on the map
						 */

						// Define the div for the tooltip
						var div = d3.select("#main").select(".tooltip")
							.style("opacity", 0);
						var map = d3.select("#svg-"+element);
						map.on("mouseover", function() {
							//alert(longTooltip);
							div.transition()
								.duration(200)
								.style("opacity", .9)
								.style("left", (d3.event.pageX + 16) + "px")
								.style("top", (d3.event.pageY + 16) + "px")
								.style("height", 20*(departmentNames.length +1) + "px");

							div.html("<ul>" + tooltip + "</ul>");
						});
						map.on("mouseout", function() {
							div.transition()
								.duration(500)
								.style("opacity", 0);
						});
					});
				});
		});
	},
	/**
	 * Erase all maps from the chart
	 */
	eraseMap: function(){
		console.log("erase map called");
		var everyMap = [];
		everyMap  = document.getElementsByClassName("small-map");
		// if maps are already there, remove them
		Array.from(everyMap).forEach( function(element){
			if(element.hasChildNodes()){
				element.childNodes.forEach(function(node){
					node.remove();
				});
			}
		});
		d3.select("#navigation-chart")
			.style("visibility", "hidden")
			.style("width", "0px")
			.style("height", "0px");
	}
};