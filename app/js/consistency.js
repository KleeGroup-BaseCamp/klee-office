/**
 * Created by msalvi on 15/09/2016.
 */

"use strict";
// global variables
var	server= "http://localhost:3000/";
//var	server= "http://local-map/";

var consistencyControl = {
    isPopin: false,
    plotconsistency: function (id, conid){
        d3.json(server + "reportConsistency/"+id, function(dataset){
            dataset.forEach(function(data){

                $('<tr>' +
                    '<td id="office-' + data.off_id + '"><div class=""><p>'+data.name+'</p></div>' +
                    '</td>' +
                    '<td class=""><div class=""><p id="former-'+data.off_id+'"></p></div>' +
                    '</td>' +
                    '<td class=""><div class=""><p>' + data.firstname + " " + data.lastname + '</p></div>' +
                    '</td>' +
                    '</tr>').insertAfter($('.table-content'));
               // console.log(data.con_id);
                // former person
                d3.json(server + "formerPeopleByOffId/"+data.off_id +"/"+ id, function(formerPerson) {
                    d3.select("#former-" + data.off_id).text(formerPerson[0].firstname + " " + formerPerson[0].lastname);
                });
            });
        });
    }
}
