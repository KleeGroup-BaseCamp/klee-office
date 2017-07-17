/**
 * Created by msalvi on 19/08/2016.
 */
/**
 * plot map on the index page
 */
(function(window){
var myData=["Alain", "GOURLAY","",""];
//console.log(d3.select("#personal-firstname")[0][0].textContent)    
d3.json(server + "currentOfficeName/" + myData[0] + "/" + myData[1], function(err, res){
        if (res.length>0){
            if (res[0].site=="La Boursidière"){
                myData[2] = res[0].name;
                myData[3]= res[0].site;}
            else if (res[0].site !==undefined ||res[0].site !=="" ||res[0].site !=="aucun"){
                myData[2] = "externe";
                myData[3]= res[0].site;}
            else{
                myData[2] = "aucun";
                myData[3]= "aucun";}
        }        
        else{
            myData[2] = "aucun";
            myData[3]= "aucun";
        };
        addEvtListenerOn("load", myData)
})

    var addEvtListenerOn = function(type, myData){
        //Define my desk and my map
        var desk,mapName;
        if (myData[3]=="La Boursidière"){
            if (myData[2]=="aucun"){
                desk="none";
                mapName="N0"; //default value
                d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous êtes sur le site La Boursidière mais vous n'avez pas d'emplacement. Veuillez mettre à jour votre bureau");
            }
            else{
                desk=myData[2];
                mapName=desk.split(/-/)[0];
                d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous êtes sur le site La Boursidière étage "+mapName+" !");
            }
        }
        else if (myData[3]=="aucun"){
            desk="none";
            mapName="N0"; //default value
            d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous n'avez pas de position. Veuillez mettre à jour votre bureau");
        }
        else {
            desk="none";
            mapName="N0"; //default value
            d3.select("#text-default").html("<img src=\"img/pin_home.png\" alt=\"My Position\" style=\"height:40px\" float:\"left\">Vous êtes sur le site "+myData[3]);
        }
        console.log(desk);
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


        mapControl.mapPlot(myData,mapName,false,function(){})           
    };
    


	//addEvtListenerOn("load", myData, window)});

    


}(window));



