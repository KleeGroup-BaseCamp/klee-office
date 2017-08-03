
(function(){
	// get vars
	var N0 = document.querySelector('#N0_plot_conf'),
		N1 = document.querySelector('#N1_plot_conf'),
		N2 = document.querySelector('#N2_plot_conf'),
		N3 = document.querySelector('#N3_plot_conf'),
		N4 = document.querySelector('#N4_plot_conf'),
		O1 = document.querySelector('#O1_plot_conf');
		O2 = document.querySelector('#O2_plot_conf'),
		O3 = document.querySelector('#O3_plot_conf'),
		O4 = document.querySelector('#O4_plot_conf');
		site = document.querySelector('.site_plot_conf');


	// register click class

    var confId=window.location.href.split('modify')[1];
	N0.addEventListener("click", function () {
		// if no map, show mapN0
		if (!mapControl.existMap) {
			mapControl.mapName = "N0";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false,function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN0
		else if (mapControl.mapName !== "N0") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N0";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false, function() {});
		}
	});
	N1.addEventListener("click", function () {
		// if no map, show mapN1
		if (!mapControl.existMap) {
			mapControl.mapName = "N1";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN1
		else if (mapControl.mapName !== "N1") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N1";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false,function() {});
		}
	});
	N2.addEventListener("click", function () {
		// if no map, show mapN2
		if (!mapControl.existMap) {
			mapControl.mapName = "N2";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN2
		else if (mapControl.mapName !== "N2") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N2";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false, function() {});
		}
	});
	N3.addEventListener("click", function () {
		// if no map, show mapN3
		if (!mapControl.existMap) {
			mapControl.mapName = "N3";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false,function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN3
		else if (mapControl.mapName !== "N3") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N3";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false,function() {});
		}
	});
	N4.addEventListener("click", function () {
		// if no map, show mapN4
		if (!mapControl.existMap) {
			mapControl.mapName = "N4";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN4
		else if (mapControl.mapName !== "N4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "N4";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false, function() {});
		}
	});
	O1.addEventListener("click", function () {
		// if no map, show mapO1
		if (!mapControl.existMap) {
			mapControl.mapName = "O1";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO1
		else if (mapControl.mapName !== "O1") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O1";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false,  function() {});
		}
	});
	O2.addEventListener("click", function () {
		// if no map, show mapO2
		if (!mapControl.existMap) {
			mapControl.mapName = "O2";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false,  function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO2
		else if (mapControl.mapName !== "O2") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O2";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false, function() {});
		}
	});
	O3.addEventListener("click", function () {
		// if no map, show mapO3
		if (!mapControl.existMap) {
			mapControl.mapName = "O3";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false,function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO3
		else if (mapControl.mapName !== "O3") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O3";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false, function() {});
		}
	});
	O4.addEventListener("click", function () {
		// if no map, show mapO4
		if (!mapControl.existMap) {
			mapControl.mapName = "O4";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false,function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapO4
		else if (mapControl.mapName !== "O4") {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = "O4";
			mapControl.confmapPlot(myData,mapControl.mapName, confId,false,function() {});
		}
	});
	d3.selectAll(".site_plot_conf").on("click",function() {
		d3.selectAll(".site_plot_conf").style("font-weight","normal");
        d3.selectAll(".list_etage").style("font-weight","normal");
        d3.select("#"+d3.event.target.id).style("font-weight","bold")
        console.log(d3.event.target);
		if (mapControl.existMap) {
			d3.select(".map").select("svg").remove();
			mapControl.existMap = false;	
		}
		$('#map-name > h1').remove();
		$('<h1 class="site-name"> '+d3.event.target.innerHTML+'</h1>').prependTo($('#map-name'));


	});
}());