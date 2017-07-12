/**
 * Created by msalvi on 19/08/2016.
 */
/**
 * plot map on the selector
 */
(function(window){


    var server="http://local-map/";
    var myData=["","",""];
    //var ok=0;	
    myData[0]=document.getElementById("personal-firstName").textContent;
    myData[1]=document.getElementById("personal-lastName").textContent;
    /*$.when(d3.json(server + "currentOfficeName/" + myData[0] + "/" + myData[1], function(err, res){
						myData[2] = res[0].name;
						d3.select("#personal-desk").html(myData[2])}))
	.then(function(myData){addEvtListenerOn("load", myData, window)});*/
    
    var addEvtListenerOn = function(type, myData){

        // tooltips for every floor
        var desk=myData[2];
	console.log(myData);
	console.log("C'est addEvtmachin!");
        var mapName=desk.split(/-/)[0];
	console.log(mapName);
        //where.addEventListener(type, function(){
		console.log("OUUUUUHouuuu");    
		mapControl.eraseMap();
		// if no map, show myMap
		if (!mapControl.existMap) {
			//mapControl.mapPlot(mapName, false, function() {});
			mapControl.existMap = true;
			console.log("cas 1 : IF");
		}
		// if other map, delete and show myMap
		else if (mapControl.mapName !== mapName) {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = mapName;
			console.log("cas 2 : ELSE IF");
			//mapControl.mapPlot(mapName, false, function() {});
		}else{
			console.log("cas 3 : ELSE");}

		if (mapName !== ""){
			$('<h1 class='+mapName+'>Etage '+mapName[1]+'<br/>('+mapName+')</h1>').prependTo($('#map-name'));}
		
	


        d3.select("#navigation-chart")
					.style("visibility", "hidden")
					.style("width", "0")
					.style("height", "0");
		d3.select("#map-show")
			.style("visibility", "visible")
			.style("width", "100%")
			.style("height", "100%");

        d3.select("#navigation")
			.style("visibility", "visible")
        d3.selectAll("#etages_withResult").style("visibility", "hidden")
					.style("width", "0px")
					.style("height", "0px")
                    .style("padding","0px");
        d3.selectAll("#etages_withoutResult").style("visibility", "visible");
        d3.select("#title-default").html("MODE Navigation");
        if(mapName !== ""){
	d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous êtes étage "+mapName+" !");}
	else{d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous n'avez pas de bureau!");}

        mapControl.mapPlot(myData,mapName,false,function(){});           
       // })
    };
    /**
     * on title 'explorer les locaux'
     */
    
     d3.json(server + "currentOfficeName/" + myData[0] + "/" + myData[1], function(err, res){
						myData[2] = res[0].name;
						console.log("test");
						d3.select("#personal-desk").html(myData[2]);
						addEvtListenerOn("load", myData)});
	//.then(function(){
	//console.log(myData);
	//addEvtListenerOn("load", myData, window)});

    


}(window));



