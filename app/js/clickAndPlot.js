// add actions for all buttons
(function(window){
	// get vars
	var buttonN0 = document.querySelector('#N0'),
		buttonN1 = document.querySelector('#N1'),
		buttonN2 = document.querySelector('#N2'),
		buttonN3 = document.querySelector('#N3'),
		buttonN4 = document.querySelector('#N4'),
		buttonO2 = document.querySelector('#O2'),
		buttonO3 = document.querySelector('#O3'),
		buttonO4 = document.querySelector('#O4');


	// register click class
	// ------------------------------
	// sloved; problem here, one click will block other clicks
	//-------------------------------
	buttonN0.addEventListener("click", function () {
		// if no map, show mapN2
		if (!mapControl.existMap) {
			mapControl.mapName = "N0";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN2
		else if (mapControl.mapName !== "N0") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N0";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
	});
	buttonN1.addEventListener("click", function () {
		// if no map, show mapN2
		if (!mapControl.existMap) {
			mapControl.mapName = "N1";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN2
		else if (mapControl.mapName !== "N1") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N1";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
	});
	buttonN2.addEventListener("click", function () {
		// if no map, show mapN2
		if (!mapControl.existMap) {
			mapControl.mapName = "N2";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN2
		else if (mapControl.mapName !== "N2") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N2";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
	});
	buttonN3.addEventListener("click", function () {
		// if no map, show mapN3
		if (!mapControl.existMap) {
			mapControl.mapName = "N3";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapControl.mapName !== "N3") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N3";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
	});
	buttonN4.addEventListener("click", function () {
		// if no map, show mapN3
		if (!mapControl.existMap) {
			mapControl.mapName = "N4";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapControl.mapName !== "N4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N4";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
	});
	buttonO2.addEventListener("click", function () {
		// if no map, show mapN3
		if (!mapControl.existMap) {
			mapControl.mapName = "O2";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapControl.mapName !== "O2") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O2";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
	});
	buttonO3.addEventListener("click", function () {
		// if no map, show mapN3
		if (!mapControl.existMap) {
			mapControl.mapName = "O3";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapControl.mapName !== "O3") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O3";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
	});
	buttonO4.addEventListener("click", function () {
		// if no map, show mapN3
		if (!mapControl.existMap) {
			mapControl.mapName = "O4";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapControl.mapName !== "O4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O4";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
	});
}(window));



