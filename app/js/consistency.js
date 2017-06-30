/**
 * Created by msalvi on 15/09/2016.
 */

"use strict";
// global variables
var	server= "http://localhost:3000/";
//var	server= "http://local-map/";

var consistencyControl = {
    isPopin: false,
    plotconsistency: function (id){
        var href = window.location.href;
        var conId;
        if (href.split("consistency").length >= 1){
            conId = href.split("consistency")[1];
        } else {
            console.err("Configuration ID is undefined.")
        }

        // plot conflics
        d3.json(server + "reportConsistency/"+id, function(dataset){
            // validate button
            $('#validate-conf').click(function(event){
                // check if there are still some conflicts between offices
                if(dataset.length === 0){
                    // call service to validate conf
                }

            });
            dataset.forEach(function(data){

                $('<tr>' +
                    '<td id="office-' + data.off_id + '"><div class=""><p>'+data.name+'</p></div>' +
                    '</td>' +
                    '<td class=""><div class=""><p id="former-'+ data.off_id + data.lastname +'"></p></div>' +
                    '</td>' +
                    '<td class=""><div class=""><p>' + data.firstname + " " + data.lastname + '</p></div>' +
                    '</td>' +
                    '</tr>').insertAfter($('.table-content'));
                // former person
                d3.json(server + "formerPeopleByOffId/"+data.off_id +"/"+ id, function(formerPerson) {
                    var formerPersName;
                    if (formerPerson.length >0){
                        formerPersName = formerPerson[0].firstname + " " + formerPerson[0].lastname;
                    } else {
                        formerPersName = "Aucun";
                    }
                    d3.select("#former-" + data.off_id+ data.lastname).text(formerPersName);
                });
            });
        });

        //table-movings

        // plot movings recap
        d3.json(server + "getRecapOfMovings/"+id, function(dataset){
            dataset.forEach(function(data){

                $('<tr>' +
                    '<td ><div class=""><p>'+data.name+'</p></div>' +
                    '</td>' +
                    '<td class=""><div class=""><p>' + data.depart+ '</p></div>' +
                    '</td>' +
                    '<td class="small"><div class=""><p>-></p></div>' +
                    '</td>' +
                    '<td class=""><div class=""><p>' + data.arrivee + '</p></div>' +
                    '</td>' +
                    '</tr>').insertAfter($('.table-movings'));
            });
        });
        $('#validateConfiguration').click(function(event){
            var success = function(){
                    window.location.href = "http://localhost:3000/configurations";
                 //window.location.href = "http://local-map/configurations";
            };
            $.ajax({
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                url: 'http://localhost:3000/validateConfiguration',
               //url: 'http://local-map/validateConfiguration',
                data: JSON.stringify({ "id": conId }),
                success: success
            });
        });
        $('#cancel').click(function(event){
           window.location.href = "http://localhost:3000/configurations";
            //window.location.href = "http://local-map/configurations";

        });

    }
}
