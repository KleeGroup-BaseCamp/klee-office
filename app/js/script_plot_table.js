/////////////////////////////
// plot tables
/////////////////////////////


/////////////////////////////
// import map from "data/N3.svg"
/////////////////////////////
"use strict";


d3.xml("http://localhost:8888/PROJET/.version0.1/data/N3_v0.8.svg", 
	function(error, documentFragment) {
		var svgNode,
			map;
		if(error) {console.log(error); return;}

		svgNode = documentFragment.getElementsByTagName("svg")[0];
		map = d3.select(".map");
		map.node().appendChild(svgNode);

		/////////////////////////////
		// Version 1: for each people, search his table
		/////////////////////////////

		d3.json("data/people.json", function(error, data) {

			/////////////////////////////
			// add names to each table
			/////////////////////////////

			var dataset = data,
				table,
				xPosition,
				yPosition;
			dataset.forEach(function(d, i) {
				d.tableID = +d.tableID;
				table = d3.select("#table"+d.tableID);  // table is a group (= rect + text(to be added))
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


