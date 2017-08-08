"use strict";
// global variables

var	server= "http://localhost:3000/";
//var	server = "http://local-map/";
var mapControl = {
	existMap: false,
	mapName: null,
	listMaps:["N0", "N1", "N2", "N3", "N4", "O4", "O3", "O2", "O1","issy", "lemans", "lyon", "bourgoin", "montpellier", "client", ""],
	mapPlot: function(myData, mapName, isSavingLocalization, callback) {
		console.log("plot mapName :"+mapName);
		if(mapName !== "" ){
		// add svg map to html
		var myDesk =myData[2];
		if (myDesk!=="aucun" || myDesk!== "externe"){
			var myMap=myDesk.split(/-/)[0];
		}else{
			var myMap="aucun";
		}
		d3.xml( server + "maps/" + mapName + ".svg",
			function(error, documentFragment) {
				if(error){
					console.log(error);
					return;
				}
				var svgNode,
					map,
					allTables,
					allAvailables;
				// request on json file

				svgNode = documentFragment.getElementsByTagName("svg")[0];
				map = d3.select(".map");
				map.node().appendChild(svgNode);
				$.each(mapControl.listMaps, function(i, name){
					// erase floor title of the legend
					if(document.getElementsByClassName(name).length >0
					&& document.getElementsByClassName(name) !== null
					&& document.getElementsByClassName(name) !== undefined){
						document.getElementsByClassName(name)[0].remove();
						}
				});
				d3.select("#legend").style("display","");
				$('<h1 class="'+mapName+'">Etage '+mapName+'</h1>').prependTo($('#map-name'));

				//to load pin on own position
				if (mapName===myMap){
					var myTable = d3.selectAll("#tables").select("#"+myDesk);
        			var myX = myTable.select("rect").attr("x")-5;
					var myY = myTable.select("rect").attr("y")-17;					        		
        			myTable.append("image")
          		  		.attr("xlink:href", "./img/pin_home.png")
           		 		.attr("width", "23")
           		 		.attr("height", "45")
           		 		.attr("x", myX)
           		 		.attr("y", myY-5);
				}

				//color of current map on the navigation menu
				d3.selectAll(".list_etage").style("font-weight","normal");
				d3.selectAll(".site").style("font-weight","normal");
				d3.selectAll(".siteResult").style("font-weight","normal");
				d3.selectAll(".siteLocation").style("font-weight","normal");

				d3.select("#"+mapName+"_withResult").style("font-weight","bold");
				d3.select("#"+mapName+"_withoutResult").style("font-weight","bold");
				d3.select("#"+mapName+"_location").style("font-weight","bold");
				d3.select("#map-info").style("display","");
				d3.select(".map-extern").style("display","none")

				// mark all tables as available
				allTables = d3.select("#tables").selectAll("g");
				allTables.attr("class", "available");

				// zoom and translate on the maps
				var zoom = d3.behavior.zoom()
					.scaleExtent([1, 8])
					.on("zoom", function() {
						var wholeMap = d3.select("#whole-map")
							.select("svg");
						wholeMap.select("#tables")
							.attr("transform", "translate(" +
							d3.event.translate + ")scale(" +
							d3.event.scale + ")");
						wholeMap.select("#AutoLayers")
							.attr("transform", "translate(" +
							d3.event.translate + ")scale(" +
							d3.event.scale + ")");

						wholeMap.on("dblclick.zoom", null);
					});
				var svg = d3.select("#whole-map")
					.select("svg").call(zoom);		
			  
				// for each people, search his table
				d3.json( server+"getInfoPerson", function(error, data) {
					var dataset = data,
						table,
						tooltip_desk = d3.select(".tooltip_map_desk"),
						tooltip_desk_empty= d3.select(".tooltip_map_desk_empty");


					$.each(dataset, function(i, data){
						// data example: ["CN=Laurence EYRAUD-JOLY,OU=Klee SA,OU=Utilisateurs,DC=KLEE,DC=LAN,DC=NET",
						//					{ "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }]
						// only need data[1]
						//var d = data[1];
						var fullName = data.firstname + " " + data.lastname;
						// split tableID into two parts.
						// ex "La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"]

						//if (d.physicalDeliveryOfficeName) {
						//	var splitID = d.physicalDeliveryOfficeName[0].split(/\s+:\s+/);

							// do following if we have the second part
							if(data.deskname){
								table = d3.select("#"+data.deskname);
								// if found in map, change table color, add hover actions
								if(table[0][0] !== null){
									// mark as occupied
									table.attr("class", "occupied");
									table.select("rect")
										.attr("id", fullName)
										.attr("fill", "#ff9900")
										.attr("cursor", "pointer");
									if (isSavingLocalization==false){
										// mouse click on the button will give more info
										$("#" + data.deskname).click( function(event) {
											tooltip_desk_empty.transition()
												.duration(1)
												.style("opacity", 0)
												.style("z-index", -1);
											var xPosition = event.pageX,
											yPosition = event.pageY;
											// get scroll pixels to correct tooltip's yPostion
											yPosition += $(window).scrollTop();
											tooltip_desk.html(fullName + "<br/>"+ data.mail + "<br/>" + data.deskname)
												.style("position","absolute")
												.style("left",xPosition-250+ "px") //d3.select('#'+data.deskname)[0][0].childNodes[0].x.animVal.valueAsString
												.style("top",yPosition-300 + "px")
												.style("height", "57px");
											tooltip_desk.transition()
												.duration(200)
												.style("opacity", .9)
												.style("z-index", 20);

											event.stopPropagation();
										});
									
										// click the tooltip won't let it disappear
										$(".tooltip_map_desk").click(function(event) {
											event.stopPropagation();
										})
										// click elsewhere will make tooltip disappear
										$("html").click(function () {
											tooltip_desk.transition()
												.duration(500)
												.style("opacity", 0)
												.style("z-index", -1);
										})		
									}		
							
								}
							}
					});
				if (isSavingLocalization==false){
					var allTablees = d3.select("#tables")
						.selectAll(".available")
						.style("cursor", "pointer")
						.on("click", function(){
							tooltip_desk.transition().duration(1).style("opacity", 0).style("z-index", -1);
							console.log("Bureau : " + d3.event.target.parentNode.id);
							var xPosition = event.clientX,
								yPosition = event.clientY;
							// get scroll pixels to correct tooltip's yPostion
							yPosition += $(window).scrollTop();
							tooltip_desk_empty.html("Bureau " + d3.event.target.parentNode.id)
													.style("position","absolute")
													.style("left", xPosition-250+ "px")
													.style("top",  yPosition-300+ "px")
													.style("height", "20px");
							tooltip_desk_empty.transition().duration(200).style("opacity", .9).style("z-index", 20);
							event.stopPropagation();	
						});								// click the tooltip won't let it disappear
						$(".tooltip_map_desk_empty").click(function(event) {
							event.stopPropagation();
						})
						// click elsewhere will make tooltip disappear
						$("html").click(function () {
							tooltip_desk_empty.transition()
												.duration(500)
												.style("opacity", 0)
												.style("z-index", -1);
						})
						// show all available tables

				}
				allAvailables = d3.select("#tables").selectAll(".available");
				allAvailables.selectAll("rect").attr("fill", "#99ff99");			
				});
				
			  
				
				if (callback){callback();}
		});
		}
	},

	// justPlotMap.js
	smallMapPlot: function(name, callback) {
		var longTooltip = [];

		d3.xml( server + "maps/" + name + ".svg",
			function(error, documentFragment) {
				if(error){
					console.log(error);
					return;
				}
				d3.select("#navigation-chart")
					.style("visibility", "visible")
					.style("width", "100%")
					.style("height", "100%");

				d3.select("#map-show")
					.style("visibility", "hidden")
					.style("width", "0px")
					.style("height", "0px");
				console.log('set invisible for ' + name);
				d3.select("#own-position")
					.style("visibility", "hidden")
					.style("width", "0px")
					.style("height", "0px");
				console.log('set invisible for ' + name);

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

					$.each(dataset, function(i, data){
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
					allAvailables.selectAll("rect").attr("fill", "#99ff99"); ///.attr("fill-opacity","");
					callback();
				});
			});
	},



	confmapPlot: function(myData, mapName, confId, isSavingLocalization,listnewmoves, callback) {
		console.log("plot confmapName :"+mapName);
		if(mapName !== "" ){
		// add svg map to html
		var myDesk =myData[2];
		if (myDesk!=="aucun" || myDesk!== "externe"){
			var myMap=myDesk.split(/-/)[0];
		}else{
			var myMap="aucun";
		}
		d3.xml( server + "maps/" + mapName + ".svg",function(error, documentFragment) {
			if(error){
					console.log(error);
					return;
			}
			// request on json file

			var svgNode = documentFragment.getElementsByTagName("svg")[0];
			var map = d3.select(".map");
			map.node().appendChild(svgNode);
			$('#map-name > h1').remove();
			d3.select("#legend").style("display","");
			$('<h1 class="'+mapName+'">Etage '+mapName+'</h1>').prependTo($('#map-name'));

			//to load pin on own position
			if (mapName===myMap){
					var myTable = d3.selectAll("#tables").select("#"+myDesk);
        			var myX = myTable.select("rect").attr("x")-5;
					var myY = myTable.select("rect").attr("y")-17;					        		
        			myTable.append("image")
          		  		.attr("xlink:href", "./img/pin_home.png")
           		 		.attr("width", "23")
           		 		.attr("height", "45")
           		 		.attr("x", myX)
           		 		.attr("y", myY-5);
			}

			//color of current map on the navigation menu
			d3.selectAll(".list_etage").style("font-weight","normal");
			d3.selectAll(".site_plot_conf").style("font-weight","normal");
			d3.selectAll(".site-conf").style("font-weight","normal");

			d3.select("#"+mapName+"_plot_conf").style("font-weight","bold");
			d3.select("#"+mapName+"_conf").style("font-weight","bold");
			d3.select("#map-info").style("display","");
			d3.select(".map-extern").style("display","none")

			// mark all tables as available
			d3.select("#tables").selectAll("g").attr("class", "available");

			// zoom and translate on the maps
			var zoom = d3.behavior.zoom()
				.scaleExtent([1, 8])
				.on("zoom", function() {
						var wholeMap = d3.select("#whole-map")
							.select("svg");
						wholeMap.select("#tables")
							.attr("transform", "translate(" +
							d3.event.translate + ")scale(" +
							d3.event.scale + ")");
						wholeMap.select("#AutoLayers")
							.attr("transform", "translate(" +
							d3.event.translate + ")scale(" +
							d3.event.scale + ")");

						wholeMap.on("dblclick.zoom", null);
				})
			/*var svg = d3.select("#whole-map")
					.select("svg").call(zoom);*/
			
							  
			// for each people, search his table
			function setColors(callback){
				d3.json( server+"getInfoPerson", function(error, data) {
					var dataset = data,
						table;
					$.each(dataset, function(i, data){
						var fullName = data.firstname + " " + data.lastname;
							if(data.deskname){
								table = d3.select("#"+data.deskname);
								// if found in map, change table color, add hover actions
								if(table[0][0] !== null){
									// mark as occupied
									table.attr("class", "occupied");
									table.select("rect")
										.attr("id", fullName)
										.attr("fill", "#ff9900")
										.attr("cursor", "pointer");							
								}
							}
					});

				//add two new classes for the current configuration
				  d3.json(server + "getRecapOfMovings/"+confId, function(dataset){
					var table;
					$.each(dataset, function(i, data){
						var fullName = data.firstname + " " + data.lastname;
    					var fromSite=data.depart.split(/\s*:\s*/)[0],
							fromDesk=data.depart.split(/\s*:\s*/)[1];
    					var toSite=data.arrivee.split(/\s*:\s*/)[0],
        					toDesk=data.arrivee.split(/\s*:\s*/)[1];
							if(fromSite=="La Boursidière" && fromDesk!="aucun"){
								table = d3.select("#"+fromDesk);
								// if found in map, change table color, add hover actions
								if(table[0][0] !== null){
									// mark as available only if not already marked in occupied temp
									if (table.select('rect').attr("fill")!="#CD5C5C"){
										table.attr("class", "available-temp");
										table.select("rect")
											.attr("id", fullName)
											.attr("fill", '#3CB371')
											.attr("cursor", "pointer");	
									}								
								}
							}
							if(toSite=="La Boursidière" && toDesk!="aucun"){
								table = d3.select("#"+toDesk);
								// if found in map, change table color, add hover actions
								if(table[0][0] !== null){
									// mark as occupied
									table.attr("class", "occupied-temp");
									table.select("rect")
										.attr("id", fullName)
										.attr("fill", "#CD5C5C")
										.attr("cursor", "pointer");
								}
							}
								
					  });
					callback();
					d3.select("#tables").selectAll(".available").selectAll("rect").attr("fill", "#99ff99");
				});

				//unsaved people in the conf
				for (var i=0;i<listnewmoves.length;i++){
					if (listnewmoves[i][4]=="new-row" && listnewmoves[i][3].split(/\s*:\s*/)[0]=="La Boursidière" && listnewmoves[i][3].split(/\s*:\s*/)[1].split(/-/)[0]==mapName){
								var toDesk=listnewmoves[i][3].split(/\s*:\s*/)[1];
								var table = d3.select("#"+toDesk);
								// if found in map, change table color, add hover actions
								if(table[0][0] !== null){
									// mark as occupied
									table.attr("class", "occupied-temp");
									table.select("rect")
										.attr("id", listnewmoves[i][0]+listnewmoves[i][1])
										.attr("fill", "#CD5C5C")
										.attr("cursor", "pointer");
								}
					}
				}
				
				
				});
			}
			//build tooltips associated with each desk
			function setTooltips(){
					var tooltip_desk = d3.select(".tooltip_map_desk"),
						tooltip_desk_empty= d3.select(".tooltip_map_desk_empty");

					//tooltip for empty desks
					var allTables_empty = d3.select("#tables")
						.selectAll(".available, .available-temp")
						.style("cursor", "pointer")
						.on("click", function(){
							tooltip_desk_empty.transition().duration(1).style("opacity", 0).style("z-index", -1);
							var xPosition = event.clientX,
								yPosition = event.clientY;
							// get scroll pixels to correct tooltip's yPostion
							yPosition += $(window).scrollTop();
							tooltip_desk_empty.html("Bureau " + d3.event.target.parentNode.id)
													.style("position","absolute")
													.style("left", xPosition-250+ "px")
													.style("top",  yPosition-300+ "px")
													.style("height", "20px");
							tooltip_desk_empty.transition().duration(200).style("opacity", .9).style("z-index", 20);
							event.stopPropagation();	
														// click the tooltip won't let it disappear
						$(".tooltip_map_desk_empty").click(function(event) {
							event.stopPropagation();
						})
						// click elsewhere will make tooltip disappear
						$("html, .occuupied, .occupied-temp").click(function () {
							tooltip_desk_empty.transition()
												.duration(500)
												.style("opacity", 0)
												.style("z-index", -1);
						})
						});
					;


					var allTables_occupied = d3.select("#tables")
						.selectAll(".occupied, .occupied-temp")
						.style("cursor", "pointer")
						.on("click", function(){
							tooltip_desk.transition().duration(1).style("opacity", 0).style("z-index", -1);
							var xPosition = event.clientX,
								yPosition = event.clientY;
							// get scroll pixels to correct tooltip's yPostion
							yPosition += $(window).scrollTop();
							tooltip_desk.html(d3.event.target.id + "<br/>"+ d3.event.target.parentNode.id)
													.style("position","absolute")
													.style("left", xPosition-250+ "px")
													.style("top",  yPosition-300+ "px")
													.style("height", "auto");
							tooltip_desk.transition().duration(200).style("opacity", .9).style("z-index", 20);
							event.stopPropagation();	
						
						// click the tooltip won't let it disappear
						$(".tooltip_map_desk").click(function(event) {
							event.stopPropagation();
						})
						// click elsewhere will make tooltip disappear
						$("html, .available, .available-temp").click(function () {
							console.log('yoyou')
											tooltip_desk.transition()
												.duration(500)
												.style("opacity", 0)
												.style("z-index", -1);
						
						})
						})
					;
			}

			setColors(function(){
				if (isSavingLocalization==false){
					setTooltips();
				}
			})
				
			if (callback){callback();}
		});
		}
	},

// Erase all maps from the chart, visualize big map with 100% width and height
	eraseMap: function() {
		// erase small maps
		var everyMap = [];
		var myMap;
		everyMap = document.getElementsByClassName("small-map");
		// if small maps are already there, remove them


		$.each(Array.from(everyMap), function(i, element){
			if (element.hasChildNodes()) {
				$.each(element.childNodes, function(i, node){
					node.remove();
				});
			}
		});

		d3.select("#navigation-chart")
			.style("visibility", "hidden")
			.style("width", "0px")
			.style("height", "0px");


		d3.select("#map-show")
			.style("visibility", "visible")
			.style("width", "100%")
			.style("height", "100%");
	}
};