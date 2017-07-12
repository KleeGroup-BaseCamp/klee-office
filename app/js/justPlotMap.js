/**
 * Created by msalvi on 19/08/2016.
 */
/**
 * plot map on the selector
 */
(function(window){

 /*NOT USED ANYMORE var mapNames = ["N0", "N1", "N2", "N3", "N4", "O4", "O3", "O2","O1"];
    var addEvtListenerOn = function(type, mapNames, where){

        // tooltips for every floor
        var toolTips = [];
        where.addEventListener(type, function(){
            var everyMap = [];
            everyMap  = document.getElementsByClassName("small-map");
            // if maps are already there, remove them
            Array.from(everyMap).forEach( function(element){
                if(element.hasChildNodes()){
                    element.childNodes.forEach(function(node){
                        node.remove();
                    });
                }
            });
            mapNames.forEach( function(element){
                mapControl.mapName = element;
                toolTips.push(mapControl.smallMapPlot(element, function() {}));
            });

            // erase normal map
            if(mapControl.existMap){
                d3.select(".map").select("svg").remove();
            }
            mapControl.existMap = false;
            console.log("existMap = false");
        });
        mapControl.buildTooltips(mapNames);
};*/
    var server="http://localhost:3000/";
    var myData=["Alain GOURLAY", ""];
    d3.json(server+"currentOfficeName/"+myData[0].split(/ /)[0]+'/'+myData[0].split(/ /)[1],function(error,res){
        if (res.length>0){
            myData[1] = res[0].name;
        }else{myData[1] ="no-desk" };
    });
    
    var addEvtListenerOn = function(type, myData, where){
        if (myData[1]=="no-desk"){
            desk="none";
            mapName="N0";
            console.log("mais ou est mon bureau?")
        }
        else{
            var desk=myData[1];
            var mapName=desk.split(/-/)[0];
        }
        where.addEventListener(type, function(){
		    mapControl.eraseMap();
		// if no map, show myMap
		if (!mapControl.existMap) {
			//mapControl.mapPlot(mapName, false, function() {});
			mapControl.existMap = true;
		}
		// if other map, delete and show myMap
		else if (mapControl.mapName !== mapName) {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = mapName;
			//mapControl.mapPlot(mapName, false, function() {});
		}
		$('<h1 class='+mapName+'>Etage '+mapName[1]+'<br/>('+mapName+')</h1>').prependTo($('#map-name'));

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
        if (desk!=="none"){
            d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous n'avez pas de position. Veuillez mettre à jour votre bureau");
        }else{
        d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous êtes étage "+mapName+" !");
        }
        mapControl.mapPlot(myData,mapName,false,function(){})           
        })
    };
    /**
     * on title 'explorer les locaux'
     */
    //addEvtListenerOn("load", mapNames, window);
    addEvtListenerOn("load", myData, window);
    //addEvtListenerOn("click", mapNames, document.querySelector("#home-label"));


}(window));