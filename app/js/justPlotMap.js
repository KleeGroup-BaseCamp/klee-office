/**
 * Created by msalvi on 19/08/2016.
 */
/**
 * plot map on the selector
 */
(function(window){

  var mapNames = ["N0", "N1", "N2", "N3", "N4", "O4", "O3", "O2"];
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
    };

    /**
     * on title 'explorer les locaux'
     */
    addEvtListenerOn("load", mapNames, window);
    addEvtListenerOn("click", mapNames, document.querySelector("#home-title"));


}(window));