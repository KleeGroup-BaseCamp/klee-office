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
    function getName(element, index, array){
        console.log(element.name);
        people.push({value: element.cn, data: element});
    }

    $.getJSON('http://localhost:8080/people', function(data) {
        //data is the JSON file
        data.forEach(getName);
        //console.log(people);

        // setup autocomplete function pulling from people[] array
        $('#search-terms').autocomplete({
        lookup: people,
        onSelect: function (suggestion) {
            var table,
                splitID,
                mapName;
        // show the map where sits selected person's table
            //console.log(suggestion.data);
            splitID = suggestion.data.tableID.split(/\s+:\s+/);
            if(splitID[1]){
                mapName = splitID[1].split(/-/)[0];
                console.log(mapName);
                map(mapName);
            }
            else{
                table = d3.select("#tables")
                            .select("#" + suggestion.data.tableID)
                            .select("rect");
                if(table[0][0]) {
                    setDefault();
                    table.attr("fill", "red");
                }
            }
        }
    });
    });


});