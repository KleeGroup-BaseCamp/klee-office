// add actions for all small maps
(function(){
	// get vars
	var N0 = document.querySelector('#N0_withoutResult'),
		N1 = document.querySelector('#N1_withoutResult'),
		N2 = document.querySelector('#N2_withoutResult'),
		N3 = document.querySelector('#N3_withoutResult'),
		N4 = document.querySelector('#N4_withoutResult'),
		O1 = document.querySelector('#O1_withoutResult');
		O2 = document.querySelector('#O2_withoutResult'),
		O3 = document.querySelector('#O3_withoutResult'),
		O4 = document.querySelector('#O4_withoutResult');
		issy = document.querySelector('#Issy-les-Moulineaux');
		lemans = document.querySelector('#le_mans');
		lyon = document.querySelector('#Lyon');
		bourgoin = document.querySelector('#Bourgoin-Jailleux');
		montpellier = document.querySelector('#Montpellier');
		client = document.querySelector('#sur_site_client');

	// register click class
	// ------------------------------
	// sloved; problem here, one click will b other clicks
	//-------------------------------

	N0.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN0
		if (!mapControl.existMap) {
			mapControl.mapName = "N0";
			mapControl.mapPlot(myData,mapControl.mapName,false,function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN0
		else if (mapControl.mapName !== "N0") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N0";
			mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
		}
		//$('<h1 class="N0">RDC (N0)</h1>').prependTo($('#map-name'));
	});
	N1.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN1
		if (!mapControl.existMap) {
			mapControl.mapName = "N1";
			mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN1
		else if (mapControl.mapName !== "N1") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N1";
			mapControl.mapPlot(myData,mapControl.mapName,false,function() {});
		}
		//$('<h1 class="N1">Etage N1</h1>').prependTo($('#map-name'));
	});
	N2.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN2
		if (!mapControl.existMap) {
			mapControl.mapName = "N2";
			mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN2
		else if (mapControl.mapName !== "N2") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N2";
			mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
		}
		//$('<h1 class="N2">Etage N2</h1>').prependTo($('#map-name'));
	});
	N3.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN3
		if (!mapControl.existMap) {
			mapControl.mapName = "N3";
			mapControl.mapPlot(myData,mapControl.mapName,false,function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapControl.mapName !== "N3") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N3";
			mapControl.mapPlot(myData,mapControl.mapName,false,function() {});
		}
		//$('<h1 class="N3">Etage N3</h1>').prependTo($('#map-name'));
	});
	N4.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapN4
		if (!mapControl.existMap) {
			mapControl.mapName = "N4";
			mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN4
		else if (mapControl.mapName !== "N4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N4";
			mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
		}
		//$('<h1 class="N4">Etage N4</h1>').prependTo($('#map-name'));
	});
	O1.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO1
		if (!mapControl.existMap) {
			mapControl.mapName = "O1";
			mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO1
		else if (mapControl.mapName !== "O1") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O1";
			mapControl.mapPlot(myData,mapControl.mapName,false,  function() {});
		}
		//$('<h1 class="O1">Etage O1</h1>').prependTo($('#map-name'));
	});
	O2.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO2
		if (!mapControl.existMap) {
			mapControl.mapName = "O2";
			mapControl.mapPlot(myData,mapControl.mapName,false,  function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO2
		else if (mapControl.mapName !== "O2") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O2";
			mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
		}
		//$('<h1 class="O2">Etage O2</h1>').prependTo($('#map-name'));
	});
	O3.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO3
		if (!mapControl.existMap) {
			mapControl.mapName = "O3";
			mapControl.mapPlot(myData,mapControl.mapName,false,function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO3
		else if (mapControl.mapName !== "O3") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O3";
			mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
		}
		//$('<h1 class="O3">Etage O3</h1>').prependTo($('#map-name'));
	});
	O4.addEventListener("click", function () {
		mapControl.eraseMap();
		// if no map, show mapO4
		if (!mapControl.existMap) {
			mapControl.mapName = "O4";
			mapControl.mapPlot(myData,mapControl.mapName,false,function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO4
		else if (mapControl.mapName !== "O4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O4";
			mapControl.mapPlot(myData,mapControl.mapName,false,function() {});
		}
		//$('<h1 class="O4">Etage O4</h1>').prependTo($('#map-name'));
	});
	issy.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#Issy-les-Moulineaux").style("font-weight","bold");
		mapControl.eraseMap();
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('<h1 class="issy">Pas de plan disponible</h1>').prependTo($('#map-name'));
	});
	lemans.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#le_mans").style("font-weight","bold");
		mapControl.eraseMap();
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('<h1 class="lemans">Pas de plan disponible</h1>').prependTo($('#map-name'));
	});
	lyon.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#Lyon").style("font-weight","bold");
		mapControl.eraseMap();
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('<h1 class="lyon">Pas de plan disponible</h1>').prependTo($('#map-name'));
	});
	bourgoin.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#Bourgoin-Jailleux").style("font-weight","bold");
		mapControl.eraseMap();
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('<h1 class="bourgoin">Pas de plan disponible</h1>').prependTo($('#map-name'));
	});
	montpellier.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#Montpellier").style("font-weight","bold");
		mapControl.eraseMap();
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('<h1 class="montpellier">Pas de plan disponible</h1>').prependTo($('#map-name'));
	});
	client.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#sur_site_client").style("font-weight","bold");
		mapControl.eraseMap();
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('<h1 class="client">Pas de plan disponible</h1>').prependTo($('#map-name'));
	});
}());



