// set all tables to their default colors
'use strict';

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

        // setup autocomplete function pulling from people[] array
        $('#search-terms').autocomplete({
        lookup: people,
        onSelect: function (suggestion) {
            var table,
                splitID,
                div,
                mapName,
                floorNumber,
                mail,
                legend;

            // suggestion.data example: 
            //      { "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }
            if (suggestion.data.physicalDeliveryOfficeName) {
                // show office name in <div id="message">
                div = d3.select("#main").select("#message");
                // show message with class focus
                div.attr("class", "focus");
                div.select("#tableID")
                    .text(suggestion.data.physicalDeliveryOfficeName[0]);

                splitID = suggestion.data.physicalDeliveryOfficeName[0]
                            .split(/\s+:\s+/);
                // if standard table ID exists
                if(splitID[1]){
                    mapName = splitID[1].split(/-/)[0];

                    // add email
                    mail = suggestion.data.mail[0];
                    div.select("#mail")
                        .text(mail);

                    // add site info
                    div.select("#site")
                        .text(splitID[0]);
                    // add building info
                    if(mapName.charAt(0) === "N"){
                        div.select("#building")
                            .text("Normandie");
                    }
                    else if (mapName.charAt(0) === "O"){
                        div.select("#building")
                            .text("Orleans");
                    }
                    // add floor info 
                    floorNumber = mapName.charAt(1);
                    switch(floorNumber) {
                        case "0":
                            div.select("#floor")
                                .text("Rdc");
                            break;
                        case "1":
                            div.select("#floor")
                                .text("1ère");
                            break;
                        default:
                            div.select("#floor")
                                .text("" + floorNumber + "ème");
                            break;
                    }

                    // if no map showing on, plot the map with name "mapName", add pin to searched person's table
                    if(!mapControl.existMap) {
                        // erase all maps' overview
                        mapControl.eraseMap();

                        mapControl.mapName = mapName;
                        mapControl.mapPlot(mapName, function() {
                            table = d3.select("#tables")
                                        .select("#" + splitID[1]);
                            table.append("image")
                                .attr("xlink:href", "./img/pin_final.png")
                                .attr("width", "30")
                                .attr("height", "50")
                                .attr("x", table.select("rect").attr("x") - 10)
                                .attr("y", table.select("rect").attr("y") - 40);
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
                                .attr("width", "30")
                                .attr("height", "50")
                                .attr("x", table.select("rect").attr("x") - 10)
                                .attr("y", table.select("rect").attr("y") - 40); 
                        });
                        mapControl.existMap = true;
                    }


                    // remove old legend and add new one
                    legend = d3.select("#legend").select("h1");
                    // if no legend
                    if(legend[0][0] == null) {
                        d3.select("#legend").insert("h1", ":first-child")
                            .attr("class", mapName)
                            .text("" + mapName.charAt(0) + " " + mapName.charAt(1));
                    }
                    // if old legend exists
                    else{
                        d3.select("#legend").select("h1")
                            .attr("class", mapName)
                            .text("" + mapName.charAt(0) + " " + mapName.charAt(1));                       
                    }
                }
                // if no standard table ID
                else {
                    // add email
                    mail = suggestion.data.mail[0];
                    div.select("#mail")
                        .text(mail);
                    // remove site, bat, etage info
                    d3.select("#message").selectAll(".content")
                        .text("");
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