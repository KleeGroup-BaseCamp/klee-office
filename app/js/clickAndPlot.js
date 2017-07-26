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
	});
	N1.addEventListener("click", function () {
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
	});
	N2.addEventListener("click", function () {
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
	});
	N3.addEventListener("click", function () {
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
	});
	N4.addEventListener("click", function () {
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
	});
	O1.addEventListener("click", function () {
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
	});
	O2.addEventListener("click", function () {
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
	});
	O3.addEventListener("click", function () {
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
	});
	O4.addEventListener("click", function () {
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
	});
	issy.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#Issy-les-Moulineaux").style("font-weight","bold");

		//hide the map form and siplay the tooltip for externe sites
		d3.select("#map-info").style("display","none");
		d3.select(".tooltip_ext_map").style("display","")
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('.tooltip_ext_map').html('<p id="noplan">Pas de plan disponible pour ce site</p><img id="noplan-logo" src="/img/logo.png" width=600px />');
	});
	lemans.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#le_mans").style("font-weight","bold");

		d3.select("#map-info").style("display","none");
		d3.select(".tooltip_ext_map").style("display","")
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('.tooltip_ext_map').html('<p id="noplan">Pas de plan disponible pour ce site</p><img id="noplan-logo" src="/img/logo.png" width=600px />');
	});
	lyon.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#Lyon").style("font-weight","bold");

		d3.select("#map-info").style("display","none");
		d3.select(".tooltip_ext_map").style("display","")
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('.tooltip_ext_map').html('<p id="noplan">Pas de plan disponible pour ce site</p><img id="noplan-logo" src="/img/logo.png" width=600px />');
	});
	bourgoin.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#Bourgoin-Jailleux").style("font-weight","bold");

		d3.select("#map-info").style("display","none");
		d3.select(".tooltip_ext_map").style("display","")
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('.tooltip_ext_map').html('<p id="noplan">Pas de plan disponible pour ce site</p><img id="noplan-logo" src="/img/logo.png" width=600px />');
	});
	montpellier.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#Montpellier").style("font-weight","bold");

		d3.select("#map-info").style("display","none");
		d3.select(".tooltip_ext_map").style("display","")
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('.tooltip_ext_map').html('<p id="noplan">Pas de plan disponible pour ce site</p><img id="noplan-logo" src="/img/logo.png" width=600px />');
	});
	client.addEventListener("click", function () {
		d3.selectAll(".site").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#sur_site_client").style("font-weight","bold");

		d3.select("#map-info").style("display","none");
		d3.select(".tooltip_ext_map").style("display","")
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('.tooltip_ext_map').html('<p id="noplan">Pas de plan disponible pour ce site</p><img id="noplan-logo" src="/img/logo.png" width=600px />');
	});
}());



