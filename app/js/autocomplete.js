// set all tables to their default colors
'use strict';
function setDefault() {
    var allemagne,
        angleterre,
        france,
        office;

    allemagne = d3.select("#layer1").select("#allemagne").selectAll("rect");
    allemagne.attr("fill", "#ccff00");

    angleterre = d3.select("#layer1").select("#angleterre").selectAll("rect");
    angleterre.attr("fill", "#68dd55");

    france = d3.select("#layer1").select("#france").selectAll("rect");
    france.attr("fill", "#ffff00");

    office = d3.select("#layer1").select(".office").selectAll("rect");
    office.attr("fill", "#18b4ff");

    return;
}


$(function(){
    var people = [];

    // arrange data in the form like [{ value: 'string', data: any }, ... ]
    function getName(element, index, array){
        console.log(element.name);
        people.push({value: element.name, data: element});
    }

    $.getJSON('http://localhost:8080/people', function(data) {
        //data is the JSON file
        data.forEach(getName);
        //console.log(people);

        // setup autocomplete function pulling from currencies[] array
        $('#search-terms').autocomplete({
        lookup: people,
        onSelect: function (suggestion) {
            var table;
        // select this table and paint it to red
            console.log(suggestion.data);
            table = d3.select("#layer1")
                        .select("#table" + suggestion.data.tableID)
                        .select("rect");
            if(table[0][0]) {
                setDefault();
                table.attr("fill", "red");
            }
        }
    });
    });


});