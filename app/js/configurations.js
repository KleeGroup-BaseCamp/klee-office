/**
 * Created by msalvi on 15/09/2016.
 */

"use strict";
// global variables
var	server= "http://localhost:3000/";

var configurationsControl = {
    plotConfList: function (){
        d3.json(server + "getAllConf", function(dataset){
            dataset.forEach(function(data){
                $('<tr>' +
                    '<td class="action-one "><div id="modify"><p></p></div>' +
                    '</td>' +
                    '<td class="action-two "><div id="print"><p></p></div>' +
                    '</td>' +
                    '<td class="action-three "><div id="validate"><p></p></div>' +
                    '</td>' +
                    '<td class="action-four "><div id="delete"><p></p></div>' +
                    '</td>' +
                    '<td ><p>' + data.name + '</p>' +
                    '</td>' +
                    '<td class="size100 center"><p>' + data.creator + '</p>' +
                    '</td>' +
                    '<td class="center"><p>' + data.dateCreation + '</p>' +
                    '</td>' +
                    '<td class="center" id="conf-' + data.con_id + '"><p></p>' +
                    '</td>' +
                    '<td><p>' + data.state+ '</p>' +
                    '</td>' +
                    '</tr>').insertAfter($('.table-content'));
                console.log(data.con_id);
                d3.json(server + "getAllMovingsByConfIdCount/:"+data.con_id, function(movings){
                    document.getElementById("conf-"+data.con_id).getElementsByTagName("p")[0].innerHTML = movings[0].count;
                });
            });
        });



    }
}
