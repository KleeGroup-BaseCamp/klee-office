/**
 * Created by msalvi on 15/09/2016.
 */

"use strict";
// global variables
//var	server= "http://localhost:3000/";
var	server= "http://local-map/";

var configurationsControl = {
    isPopin: false,
    plotConfList: function (level,dep){
        console.log("level"+level+" dep"+dep)
        d3.json(server + "getAllConf/", function(dataset){
            var dateCrea,link='configurations';
            dataset.forEach(function(data){
                if(data.date!== null && data.date !== undefined && data.date !== ""){
                    dateCrea = data.date.replace('T',' ').replace('Z',' ').substring(0,data.date.length-5);
                } else {
                    dateCrea = data.date;
                }

                $('<tr>' +
                    '<td class="action-one "><div class="modify"><p id="modif-' + data.set_id + '"></p></div>' +
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
                d3.json(server + "getAllMovingsByConfIdCount/"+data.set_id, function(movings){
                    document.getElementById("conf-"+data.set_id).getElementsByTagName("p")[0].innerHTML = movings[0].count;
                });
                $("#modif-"+data.set_id).click(function(event) {
                    window.location.href='modify' + data.set_id;
                });

                // print button
                $("#print-"+data.set_id).click(function(event) {
                    window.open('getMovingsListByConfId/' + data.set_id);
                });

                // validate button
                $("#validate-"+data.set_id).click(function(event) {
                    if(configurationsControl.isPopin !== true){
                        if (data.state=="Brouillon"){
                            d3.json(server + "isConfValid/"+data.set_id, function(countInvalid){
                                if (countInvalid[0].count==0){
                                  $('<div id="popin-val">'+
                                    '<h3>Voulez-vous confirmer la configuration numéro '+data.set_id+'?</h3>'+
                                    '<p id="description-conf" >'+
                                        'Nom : '+data.name+'</br>'+
                                        'Créateur : '+data.creator+'</br>'+
                                        'Date de dernière mise à jour : '+new Date(data.date).toDateString()+
                                    '</p>'+
                                    '<div id="myrecap">'+
                                    '<table id="table-recap-conf"><thead>'+
                                        '<tr>'+
                                            '<th>Nom</th>'+
                                            '<th>Prénom</th>'+
                                            '<th>Bureau actuel</th>'+
                                            '<th>Bureau cible</th>'+
                                        '</tr>'+
                                    '</thead></table>'+
                                    '</div>'+
                                    '<div id="popin-button">'+
                                        '<button id="valider-conf" >Valider</button>'+
                                        '<button id="cancel-val">Annuler</button>'+
                                    '</div>'+
                                  '</div>').insertAfter($('.two-columns'));

                                    $("#valider-conf").click(function () {
                                        $('#popin-val').remove();
                                        configurationsControl.isPopin = false;
                                        $.ajax({
                                            url: 'validateConfiguration',
                                            type: 'POST',
                                            data:{setid:data.set_id},
                                            success: function(result) {
                                                location.reload();
                                            }
                                        });
                                    });
                                }else{
                                    $('<div id="popin-val">'+
                                        '<h3>La configuration numéro '+data.set_id+' n\'est pas valide</h3>'+
                                    '<p id="description-conf" >'+
                                        'Nom : '+data.name+'</br>'+
                                        'Créateur : '+data.creator+'</br>'+
                                        'Date de dernière mise à jour : '+new Date(data.date).toDateString()+
                                    '</p>'+
                                    '<div id="myrecap">'+
                                    '<table id="table-recap-conf"><thead>'+
                                        '<tr>'+
                                            '<th>Nom</th>'+
                                            '<th>Prénom</th>'+
                                            '<th>Bureau actuel</th>'+
                                            '<th>Bureau cible</th>'+
                                        '</tr>'+
                                    '</thead></table>'+
                                    '</div>'+
                                    '<div id="popin-button">'+
                                         '<p>Veuillez corriger les erreurs avant de valider</p></br>'+
                                        '<button><a href='+server+'modify'+data.set_id+'>Modifier</a></button>'+
                                        '<button id="cancel-val">Annuler</button>'+
                                    '</div>'+
                                  '</div>').insertAfter($('.two-columns'));
                                }
                                $("#popin-val").click(function (event) {event.stopPropagation(); });
                                $("#cancel-val").click(function () {
                                    $('#popin-val').remove();
                                    configurationsControl.isPopin = false;
                                }); 
                            })
                        }else{
                            $('<div id="popin-val">'+
                            '<h3>La configuration numéro '+data.set_id+' est déjà validée</h3>'+
                            '<p id="description-conf" >'+
                                'Nom : '+data.name+'</br>'+
                                'Créateur : '+data.creator+'</br>'+
                                'Date de dernière mise à jour : '+new Date(data.date).toDateString()+
                            '</p>'+
                            '<div id="myrecap">'+
                            '<table id="table-recap-conf"><thead>'+
                                '<tr>'+
                                    '<th>Nom</th>'+
                                    '<th>Prénom</th>'+
                                    '<th>Bureau actuel</th>'+
                                    '<th>Bureau cible</th>'+
                                '</tr>'+
                            '</thead></table>'+
                            '</div>'+
                            '<div id="popin-button">'+
                                '<button id="cancel-val" >Annuler</button>'+
                            '</div>'+
                            '</div>').insertAfter($('.two-columns'));
                        }
                    
                        d3.json(server + "getRecapOfMovings/"+data.set_id, function(movelines){
                            for (var i=0;i<movelines.length;i++){
                                $("<tr><td>"+movelines[i].lastname+"</td><td>"+movelines[i].firstname+"</td><td>"+movelines[i].depart+"</td><td>"+movelines[i].arrivee+"</td></tr>").appendTo("#table-recap-conf")
                            }
                        });

                        configurationsControl.isPopin = true;
                        d3.select("#popin-val").style("top",event.pageY-100+"px")
                        $("#popin-val, .validate, #add-title").click(function (event) {
                            event.stopPropagation();
                        });
                        $("#cancel-val").click(function () {
                            $('#popin-val').remove();
                            configurationsControl.isPopin = false;
                        }); 
                    }
                });
                
                $("html").click(function () {
                    if(configurationsControl.isPopin === true){
                        $('#popin-val').remove();
                        configurationsControl.isPopin = false;
                    }
                });
                // delete button
                $("#delete-"+data.set_id).click(function(event){
                    event.stopPropagation();
                    d3.json(server +"deleteConfiguration/"+data.set_id, function(){
                        console.log("delete my config !")
                        event.target.parentNode.parentNode.parentNode.remove()
                    })
                    .header("Content-Type","application/json")
                    .send("DELETE", JSON.stringify({}));  
                });
            });
        });
    }
}
