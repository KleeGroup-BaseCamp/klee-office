/**
 * Created by msalvi
 */

/**
 * plot map on the selector
 */
(function(window){
    var server= "http://localhost:3000/"
    //var server= "http://local-map/"
    var mapNames = ["N0", "N1", "N2", "N3", "N4", "O4", "O3", "O2","O1"];
    var myData=["Alain GOURLAY","N4-C-01"];

    /**
     * on floor name : click to choose a floor and plot it
     */
    $.each(mapNames, function(index, name){
        var href = window.location.href;
        var split = href.split("modify");
        var conId = split[1];
        document.querySelector('#'+name).addEventListener("click", function(){
            mapControl.eraseMap();
            d3.select("#offices-chart").style("visibility", "hidden");
            d3.select("#loc-form").style("visibility", "visible");
            d3.selectAll(".hidden").style("visibility", "hidden");
            d3.selectAll(".hidden").style("width", "0px");
            d3.select("#step-one").style("color", "#6d6e71");
            d3.select("#step-two").style("color", "#246b8f");

            // if no map, show map
            if (!mapControl.existMap) {
                mapControl.mapName = name;
                mapControl.confmapPlot(myData,mapControl.mapName,  function() {});
                mapControl.existMap = true;
            }
            // if other map, delete and show mapN0
            else if (mapControl.mapName !== name) {
                d3.select(".map").select("svg").remove();
                mapControl.mapName = name;
                mapControl.confmapPlot(myData,mapControl.mapName,  function() {});
            }
            if (name === "N0"){
                $('<h1 class="N0">RDC<br/>(N 0)</h1>').prependTo($('#legend'));
            } else {
                $('<h1 class='+name+'>('+name+')</h1>').prependTo($('#legend'));
            }
            // here a name is already set to be able to test the service but it has to be replaced with the name of the connected person
            d3.json( server+"getCurrentOfficeName/Thomas/GALLON", function(error, data) { //remplacer par le bureau de l'utilisateur connecté
                d3.select("#former-office").attr("value", data[0].name);
                d3.select("#former-office-id").attr("value", data[0].off_id);
            });
            event.stopPropagation();
        });
    });

    /**
     * on step one title
     * back to step one
     */
    document.querySelector('#step-one').addEventListener("click", function(){
        d3.select("#map-show").style("visibility", "hidden");
        d3.select("#loc-form").style("visibility", "hidden");
        d3.select("#offices-chart").style("visibility", "visible");
        d3.select("#step-one").style("color", "#246b8f");
        d3.select("#step-two").style("color", "#6d6e71");
    });

}(window));