/////////////////////////////
// plot tables
/////////////////////////////

(function(window){
	// get vars
	var buttonN2 = document.querySelector('#N2'),
		buttonN3 = document.querySelector('#N3');

	// register click class
	// ------------------------------
	// problem here, one click will block other clicks
	//-------------------------------
	buttonN2.addEventListener("click", function () {
		// if no map, show mapN2
		if (!d3.select("#wholeMap")[0][0]) {
			mapN2();
		}
		// if other map, delete and show mapN2
		else if (!d3.select("#mapN2")[0][0]) {
			d3.select(".map").select("svg").remove();
			mapN2();
		}
	});
	buttonN3.addEventListener("click", function () {
		// if no map, show mapN3
		if (!d3.select("#wholeMap")[0][0]) {
			mapN3();
		}
		// if other map, delete and show mapN3
		else if (!d3.select("#mapN3")[0][0]) {
			d3.select(".map").select("svg").remove();
			mapN3();
		}
	});
}(window));
/////////////////////////////
// import map from "/maps/"
/////////////////////////////
"use strict";

function mapN2() {
	d3.xml("http://localhost:8080/maps/N2.svg", 
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
				xPosition,
				yPosition;
			dataset.forEach(function(d, i) {
				d.tableID = +d.tableID;
				table = d3.select("#table"+d.tableID);
				if(table[0][0] !== null){
					table.append("text")
						.attr("x", table.select("rect").attr("x"))
						.attr("y", table.select("rect").attr("y"))
						.attr("dy", ".75em")
						.attr("fill", "black")
						.attr("stroke-width", 0)
						.text(d.name);
					table.select("rect").attr("id", d.name);

					// mouse hover on the text will give more info
					table.on("mouseover", function() {
						xPosition = 850 ;
						yPosition = parseFloat(d3.select(this) 
														.select("rect").attr("y") );
						table.append("text")
							.attr("id", "tooltip")
							.attr("x", xPosition)
							.attr("y", yPosition)
							.attr("dy", ".75em")
							.attr("text-anchor", "middle")
							.attr("font-family", "sans-serif")
							.attr("font-size", "15px")
							.attr("font-weight", "bold")
							.attr("fill", "red")
							.text("email: " + d.email);
					});

					table.on("mouseout", function() {
						d3.select("#tooltip").remove();
					});	
				}
			});
		});
});
}

function mapN3() {
	d3.xml("http://localhost:8080/maps/N3.svg", 
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
				xPosition,
				yPosition;
			dataset.forEach(function(d, i) {
				d.tableID = +d.tableID;
				table = d3.select("#table"+d.tableID);
				if(table[0][0] !== null){
					table.append("text")
						.attr("x", table.select("rect").attr("x"))
						.attr("y", table.select("rect").attr("y"))
						.attr("dy", ".75em")
						.attr("fill", "black")
						.attr("stroke-width", 0)
						.text(d.name);
					table.select("rect").attr("id", d.name);

					// mouse hover on the text will give more info
					table.on("mouseover", function() {
						xPosition = 850 ;
						yPosition = parseFloat(d3.select(this) 
														.select("rect").attr("y") );
						table.append("text")
							.attr("id", "tooltip")
							.attr("x", xPosition)
							.attr("y", yPosition)
							.attr("dy", ".75em")
							.attr("text-anchor", "middle")
							.attr("font-family", "sans-serif")
							.attr("font-size", "15px")
							.attr("font-weight", "bold")
							.attr("fill", "red")
							.text("email: " + d.email);
					});

					table.on("mouseout", function() {
						d3.select("#tooltip").remove();
					});	
				}
			});
		});
});
}





