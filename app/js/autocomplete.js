// set all tables to their default colors
'use strict';
// function setDefault() {
//     var allemagne,
//         angleterre,
//         france,
//         office;

//     allemagne = d3.select("#layer1").select("#allemagne").selectAll("rect");
//     allemagne.attr("fill", "#ccff00");

//     angleterre = d3.select("#layer1").select("#angleterre").selectAll("rect");
//     angleterre.attr("fill", "#68dd55");

//     france = d3.select("#layer1").select("#france").selectAll("rect");
//     france.attr("fill", "#ffff00");

//     office = d3.select("#layer1").select(".office").selectAll("rect");
//     office.attr("fill", "#18b4ff");

//     return;
// }

$(function(){
    var people = [];

    // arrange data in the form like [{ value: 'string', data: any }, ... ]
    // element example: ["CN=Laurence EYRAUD-JOLY,OU=Klee SA,OU=Utilisateurs,DC=KLEE,DC=LAN,DC=NET", 
    //                  { "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }]
    // only need element[1]
    function getName(element, index, array){
        console.log(element[1].cn[0]);
        people.push({value: element[1].cn[0], data: element[1]});
    }

    $.getJSON('http://local-map/people', function(data) {
        //data is the JSON file
        data.forEach(getName);
        //console.log(people);

        // setup autocomplete function pulling from people[] array
        $('#search-terms').autocomplete({
        lookup: people,
        onSelect: function (suggestion) {
            var table,
                splitID,
                mapName,
                div;

            // suggestion.data example: 
            //      { "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }
            if (suggestion.data.physicalDeliveryOfficeName) {
                // show office name in <div id="message">
                div = d3.select("#main").select("#message");
                div.html("Site: " + suggestion.data.physicalDeliveryOfficeName[0]);
                div.attr("class", "focus");

                splitID = suggestion.data.physicalDeliveryOfficeName[0]
                            .split(/\s+:\s+/);
                if(splitID[1]){
                    mapName = splitID[1].split(/-/)[0];
                    // if no map showing on, plot the map with name "mapName", add pin to searched person's table
                    if(!mapControl.existMap) {
                        mapControl.mapName = mapName;
                        mapControl.mapPlot(mapName, function() {
                            table = d3.select("#tables")
                                        .select("#" + splitID[1]);
                            table.append("image")
                                .attr("xlink:href", "./img/pin_final.png")
                                .attr("width", "10")
                                .attr("height", "20")
                                .attr("x", table.select("rect").attr("x"))
                                .attr("y", table.select("rect").attr("y"));
                        });
                        mapControl.existMap = true;
                    }
                    // if a map exists, erase it and replot one 
                    else {
                        d3.select(".map").select("svg").remove();
                        mapControl.existMap = false;
                        mapControl.mapName = mapName;
                        mapControl.mapPlot(mapName, function() {
                            table = d3.select("#tables")
                                        .select("#" + splitID[1]);
                            table.append("image")
                                .attr("xlink:href", "./img/pin_final.png")
                                .attr("width", "10")
                                .attr("height", "20")
                                .attr("x", table.select("rect").attr("x"))
                                .attr("y", table.select("rect").attr("y")); 
                        });
                        mapControl.existMap = true;
                    }
                }
            }

            else {
                // show "no office" in <div id="message">
                div = d3.select("#main").select("#message");
                div.html("No office for this poor man !");
                div.attr("class", "focus");
            }
        }
        });
    });
});