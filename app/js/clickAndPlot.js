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
		mapControl.eraseMap();
		// if no map, show mapN0
		if (!mapControl.existMap) {
			mapControl.mapName = "N0";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN0
		else if (mapControl.mapName !== "N0") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N0";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
		$('<h1 class="N0">N 0</h1>').prependTo($('#legend'));
	});
	buttonN1.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN1
		if (!mapControl.existMap) {
			mapControl.mapName = "N1";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN1
		else if (mapControl.mapName !== "N1") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N1";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
		$('<h1 class="N1">N 1</h1>').prependTo($('#legend'));
	});
	buttonN2.addEventListener("click", function () {
		mapControl.eraseMap();
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
		$('<h1 class="N2">N 2</h1>').prependTo($('#legend'));
	});
	buttonN3.addEventListener("click", function () {
		mapControl.eraseMap();
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
		$('<h1 class="N3">N 3</h1>').prependTo($('#legend'));
	});
	buttonN4.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN4
		if (!mapControl.existMap) {
			mapControl.mapName = "N4";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN4
		else if (mapControl.mapName !== "N4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N4";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
		$('<h1 class="N4">N 4</h1>').prependTo($('#legend'));
	});
	buttonO2.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO2
		if (!mapControl.existMap) {
			mapControl.mapName = "O2";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO2
		else if (mapControl.mapName !== "O2") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O2";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
		$('<h1 class="O2">O 2</h1>').prependTo($('#legend'));
	});
	buttonO3.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO3
		if (!mapControl.existMap) {
			mapControl.mapName = "O3";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO3
		else if (mapControl.mapName !== "O3") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O3";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
		$('<h1 class="O3">O 3</h1>').prependTo($('#legend'));
	});
	buttonO4.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO4
		if (!mapControl.existMap) {
			mapControl.mapName = "O4";
			mapControl.mapPlot(mapControl.mapName, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO4
		else if (mapControl.mapName !== "O4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O4";
			mapControl.mapPlot(mapControl.mapName, function() {});
		}
		$('<h1 class="O4">O 4</h1>').prependTo($('#legend'));
	});
}(window));



