/**
 * Created by msalvi on 19/08/2016.
 */
/**
 * plot map on the selector
 */
(function(window){


        // tooltips for every floor
       /* var toolTips = [];
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
    var myData=["Alain", "GOURLAY",""];
    //myData[0]=document.getElementById("personal-firstName").textContent;
    //myData[1]=document.getElementById("personal-lastName").textContent;

    d3.json(server + "currentOfficeName/" + myData[0] + "/" + myData[1], function(err, res){
        if (res.length>0){
            myData[2] = res[0].name;
        }else{myData[2] ="no-desk" };
		addEvtListenerOn("load", myData)
    });
    
    var addEvtListenerOn = function(type, myData){
        //Define my desk and my map
        var desk,mapName;
        if (myData[2]=="no-desk"){
            desk="none";
            mapName="N0"; //default value
            console.log("mais ou est mon bureau?")
        }
        else{
            desk=myData[2];
            mapName=desk.split(/-/)[0];
        }

		mapControl.eraseMap();
		// if no map, show myMap
		if (!mapControl.existMap) {
			mapControl.existMap = true;
		}
		// if other map, delete and show myMap
		else if (mapControl.mapName !== mapName) {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = mapName;}
			
        $('<h1 class='+mapName+'>Etage '+mapName[1]+'<br/>('+mapName+')</h1>').appendTo($('#map-name'));
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

        if (desk=="none"){
            d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous n'avez pas de position. Veuillez mettre à jour votre bureau");
        }else{
        d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous êtes étage "+mapName+" !");
        }
        mapControl.mapPlot(myData,mapName,false,function(){})           
    };
    


	//addEvtListenerOn("load", myData, window)});

    


}(window));



