// add actions for all small maps
(function(window){
	// get vars
	var N0 = document.querySelector('#svg-N0'),
		N1 = document.querySelector('#svg-N1'),
		N2 = document.querySelector('#svg-N2'),
		N3 = document.querySelector('#svg-N3'),
		N4 = document.querySelector('#svg-N4'),
		O2 = document.querySelector('#svg-O2'),
		O3 = document.querySelector('#svg-O3'),
		O4 = document.querySelector('#svg-O4');


	// register click class
	// ------------------------------
	// sloved; problem here, one click will block other clicks
	//-------------------------------
	N0.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN0
		if (!mapControl.existMap) {
			mapControl.mapName = "N0";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN0
		else if (mapControl.mapName !== "N0") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N0";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
		}
		$('<h1 class="N0">RDC<br/>(N 0)</h1>').prependTo($('#legend'));
	});
	N1.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN1
		if (!mapControl.existMap) {
			mapControl.mapName = "N1";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN1
		else if (mapControl.mapName !== "N1") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N1";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
		}
		$('<h1 class="N1">Etage 1<br/>(N 1)</h1>').prependTo($('#legend'));
	});
	N2.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN2
		if (!mapControl.existMap) {
			mapControl.mapName = "N2";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN2
		else if (mapControl.mapName !== "N2") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N2";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
		}
		$('<h1 class="N2">Etage 2<br/>(N 2)</h1>').prependTo($('#legend'));
	});
	N3.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN3
		if (!mapControl.existMap) {
			mapControl.mapName = "N3";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapControl.mapName !== "N3") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N3";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
		}
		$('<h1 class="N3">Etage 3<br/>(N 3)</h1>').prependTo($('#legend'));
	});
	N4.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN4
		if (!mapControl.existMap) {
			mapControl.mapName = "N4";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN4
		else if (mapControl.mapName !== "N4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N4";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
		}
		$('<h1 class="N4">Etage 4<br/>(N 4)</h1>').prependTo($('#legend'));
	});
	O2.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO2
		if (!mapControl.existMap) {
			mapControl.mapName = "O2";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO2
		else if (mapControl.mapName !== "O2") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O2";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
		}
		$('<h1 class="O2">Etage 2<br/>(O 2)</h1>').prependTo($('#legend'));
	});
	O3.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO3
		if (!mapControl.existMap) {
			mapControl.mapName = "O3";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO3
		else if (mapControl.mapName !== "O3") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O3";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
		}
		$('<h1 class="O3">Etage 3<br/>(O 3)</h1>').prependTo($('#legend'));
	});
	O4.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO4
		if (!mapControl.existMap) {
			mapControl.mapName = "O4";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO4
		else if (mapControl.mapName !== "O4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O4";
			mapControl.mapPlot(mapControl.mapName, false, function() {});
		}
		$('<h1 class="O4">Etage 4<br/>(O 4)</h1>').prependTo($('#legend'));
	});
}(window));



