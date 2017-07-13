/**
 * Created by msalvi on 15/09/2016.
 */

"use strict";
// global variables
var	server= "http://localhost:3000/";
//var	server= "http://local-map/";

var configurationsControl = {
    isPopin: false,
    plotConfList: function (level){
        console.log(level);
        if (level=="1"){ 
          d3.json(server + "getConfByDep", function(dataset){
            var dateCrea;
            dataset.forEach(function(data){
                if(data.dateCreation !== null && data.dateCreation !== undefined && data.dateCreation !== ""){
                    dateCrea = data.dateCreation.split(" ")[0];
                } else {
                    dateCrea = data.dateCreation;
                }
                $('<tr>' +
                    '<td class="action-one "><div class="modify"><a href="/modify' +  data.set_id + '" ><p id="modif-' + data.set_id + '"></p></a></div>' +
                    '</td>' +
                    '<td class="action-two "><div class="print"><p id="print-' + data.set_id + '"></p></div>' +
                    '</td>' +
                    '<td class="action-three "><div class="validate"><p id="validate-' + data.set_id + '"></p></div>' +
                    '</td>' +
                    '<td class="action-four "><div class="delete" ><p id="delete-' + data.set_id + '"></p></div>' +
                    '</td>' +
                    '<td ><p>' + data.name + '</p>' +
                    '</td>' +
                    '<td class="size100 center"><p>' + data.creator + '</p>' +
                    '</td>' +
                    '<td class="center"><p>' + dateCrea + '</p>' +
                    '</td>' +
                    '<td class="center" id="conf-' + data.set_id + '"><p></p>' +
                    '</td>' +
                    '<td><p>' + data.state+ '</p>' +
                    '</td>' +
                    '</tr>').insertAfter($('.table-content'));
                console.log(data.set_id);
                d3.json(server + "getAllMovingsByConfIdCount/"+data.set_id, function(movings){
                    document.getElementById("conf-"+data.set_id).getElementsByTagName("p")[0].innerHTML = movings[0].count;
                });

                // print button
                $("#print-"+data.set_id).click(function(event) {
                    window.open('getMovingsListByConfId/' + data.set_id);
                });

                // validate button
                $("#validate-"+data.set_id).click(function(event) {
                    window.location.href = server+"consistency" + data.set_id;
                });

                // delete button
                $("#delete-"+data.set_id).click(function(event){
                    console.log("plap");
                    event.stopPropagation();
                    $.ajax({
                        url: 'deleteConfiguration/'+data.set_id,
                        type: 'DELETE',
                        success: function(result) {
                          window.location.href = server+"configurations";
                        }
                    });
                });
            });
         });
        }

        if (level=="2"){
          console.log("I'm validator 2")
        d3.json(server + "getAllConf", function(dataset){
            var dateCrea;
            dataset.forEach(function(data){
                if(data.dateCreation !== null && data.dateCreation !== undefined && data.dateCreation !== ""){
                    dateCrea = data.dateCreation.split(" ")[0];
                } else {
                    dateCrea = data.dateCreation;
                }
                $('<tr>' +
                    '<td class="action-one "><div class="modify"><a href="/modify' +  data.set_id + '" ><p id="modif-' + data.set_id + '"></p></a></div>' +
                    '</td>' +
                    '<td class="action-two "><div class="print"><p id="print-' + data.set_id + '"></p></div>' +
                    '</td>' +
                    '<td class="action-three "><div class="validate"><p id="validate-' + data.set_id + '"></p></div>' +
                    '</td>' +
                    '<td class="action-four "><div class="delete" ><p id="delete-' + data.set_id + '"></p></div>' +
                    '</td>' +
                    '<td ><p>' + data.name + '</p>' +
                    '</td>' +
                    '<td class="size100 center"><p>' + data.creator + '</p>' +
                    '</td>' +
                    '<td class="center"><p>' + dateCrea + '</p>' +
                    '</td>' +
                    '<td class="center" id="conf-' + data.set_id + '"><p></p>' +
                    '</td>' +
                    '<td><p>' + data.state+ '</p>' +
                    '</td>' +
                    '</tr>').insertAfter($('.table-content'));
                console.log(data.set_id);
                d3.json(server + "getAllMovingsByConfIdCount/"+data.set_id, function(movings){
                    document.getElementById("conf-"+data.set_id).getElementsByTagName("p")[0].innerHTML = movings[0].count;
                });

                // print button
                $("#print-"+data.set_id).click(function(event) {
                    window.open('getMovingsListByConfId/' + data.set_id);
                });

                // validate button
                $("#validate-"+data.set_id).click(function(event) {
                    window.location.href = server+"consistency" + data.set_id;
                });

                // delete button
                $("#delete-"+data.set_id).click(function(event){
                    console.log("plap");
                    event.stopPropagation();
                    $.ajax({
                        url: 'deleteConfiguration/'+data.set_id,
                        type: 'DELETE',
                        success: function(result) {
                          window.location.href = server+"configurations";
                        }
                    });
                });
            });
        });
      }
    }
}
