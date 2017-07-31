// set all tables to their default colors
'use strict';
var server='http://localhost:3000/'
var myData=[d3.select("#personal-firstname")[0][0].textContent, d3.select("#personal-lastname")[0][0].textContent,"",""];

$(function(){
    var people = [];

    // arrange data in the form like [{ value: 'string', data: any }, ... ]
    // element example: ["CN=Laurence EYRAUD-JOLY,OU=Klee SA,OU=Utilisateurs,DC=KLEE,DC=LAN,DC=NET", 
    //                  { "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }]
    // only need element[1]
    function getName(element, index, array){
        people.push({value: element[1].cn[0], data: element[1]});
    }

    $.getJSON(server+'people', function(data) {
        //data is the JSON file
        data.forEach(getName);

        // setup autocomplete function pulling from people[] array
        $('#search-one-term')
        .autocomplete({
            lookup: people,
            onSelect: function (suggestion) {
                var table,
                    mapName,
                    site,
                    desk;

            // suggestion.data example: 
            //      { "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }
            if (suggestion.data.physicalDeliveryOfficeName) {
                var location=suggestion.data.physicalDeliveryOfficeName[0]
                console.log(suggestion.data.physicalDeliveryOfficeName)
                if (location.split(' : ').length==2){
                    site=location.split(' : ')[0];
                    desk=location.split(' : ')[1];
                    mapName=desk.substring(0,2);
                }
                else{
                    site=location;
                    desk="aucun";
                    mapName="None";
                }
                d3.select("#text-conf").html(suggestion.data.cn+' est localisé '+location+'</br>Sélectionnez son nouvel emplacement')
                
                if (mapName!="None"){
                    // if no map showing on, plot the map with name "mapName", add pin to searched person's table
                    if(!mapControl.existMap) {
                        // erase all maps' overview
                       // mapControl.eraseMap();
                        mapControl.mapName = mapName;
                        mapControl.mapPlot(myData,mapName, false, function() {
                            table = d3.select("#tables")
                                        .select("#" + desk);
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
                        mapControl.mapPlot(myData,mapName, false, function() {
                            table = d3.select("#tables")
                                        .select("#" + desk);
                            table.append("image")
                                .attr("xlink:href", "./img/pin_final.png")
                                .attr("width", "30")
                                .attr("height", "50")
                                .attr("x", table.select("rect").attr("x") - 10)
                                .attr("y", table.select("rect").attr("y") - 40); 
                        });
                        mapControl.existMap = true;
                    }

                }
                    // remove old legend and add new one
                    /*legend = d3.select("#legend").select("h1");
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
                    // remove site, bat, etage info
                    d3.select("#message").selectAll(".content")
                        .text("");
                    // add email
                    mail = suggestion.data.mail[0];
                    div.select("#mail")
                        .text(mail);
                }*/
            }
            // physicalDeliveryOfficeName doesn't exist
            /*else {
                // add email
                mail = suggestion.data.mail[0];
                div.select("#mail")
                    .text(mail);
                // show "no office" in <div id="message">
                div = d3.select("#main").select("#message");
                div.html("No office for this poor man !");
                div.attr("class", "focus");
            }*/
        }
        });
    });
});