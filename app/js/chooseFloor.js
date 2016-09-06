/**
 * Created by msalvi on 19/08/2016.
 */
/**
 * plot map on the selector
 */
(function(window){

  var mapNames = ["N0", "N1", "N2", "N3", "N4", "O4", "O3", "O2"];
    var addEvtListenerOn = function(type, mapNames, where){

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
                mapControl.smallMapPlot(element, function() {});
            });
        });
    };

    /**
     * on page load, plot offices maps
     * on click on step one title
     */
    addEvtListenerOn("load", mapNames, window);
    addEvtListenerOn("click", mapNames, document.querySelector('#step-one'));

    /**
     * on floor name : click to choose a floor and plot it
     */
    mapNames.forEach(function(name){
        document.querySelector('#'+name).addEventListener("click", function(){

           mapControl.eraseMap();
           d3.select("#offices-chart").style("visibility", "hidden");
           d3.select("#step-one").style("color", "#6d6e71");
           d3.select("#step-two").style("color", "#246b8f");

            // if no map, show map
            if (!mapControl.existMap) {
                mapControl.mapName = name;
                mapControl.mapPlot(mapControl.mapName, true, function() {});
                mapControl.existMap = true;
            }
            // if other map, delete and show mapN0
            else if (mapControl.mapName !== name) {
                d3.select(".map").select("svg").remove();
                mapControl.mapName = name;
                mapControl.mapPlot(mapControl.mapName, true, function() {});
            }
            if (name === "N0"){
                $('<h1 class="N0">RDC<br/>(N 0)</h1>').prependTo($('#legend'));
            } else {
                $('<h1 class='+name+'>('+name+')</h1>').prependTo($('#legend'));
            }
        });
    });

    /**
     * on step one title
     * back to step one
     */
    document.querySelector('#step-one').addEventListener("click", function(){
        d3.select("#map-show")
            .style("visibility", "hidden");
        d3.select("#offices-chart").style("visibility", "visible");
        d3.select("#step-one").style("color", "#246b8f");
        d3.select("#step-two").style("color", "#6d6e71");
    });

    //                var allTables = d3.select("#tables").selectAll('g');

}(window));