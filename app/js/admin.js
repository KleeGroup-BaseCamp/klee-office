/**
 * Created by msalvi on 08/09/2016.
 */

"use strict";
// global variables
var	server= "http://localhost:3000/";
//var	server = "http://local-map/";

var adminControl = {
    alreadyOneSelected: false,
    /**
     * erase rects list
     * @param list
     */
    erase: function(list){
        // remove lists
        if(list !== null && list !== undefined && list.length > 0) {
            Array.from(list).forEach(function (element) {
                element.remove();
            });
        }
    },
    /**
     * erase all rects lists
     */
    eraseAll: function(){
        var dpt = document.getElementsByClassName("dpt-rect");
        var comp = document.getElementsByClassName("company-rect");
        var people = document.getElementsByClassName("people-rect");
        var remove = document.getElementsByClassName("remove");
        this.erase(dpt);
        this.erase(comp);
        this.erase(people);
        this.erase(remove);
    },
    plotValidatorsList: function(){
        function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
        }
        d3.json(server+ "getAllCompanies",function(error,datasetComp){
            datasetComp.forEach(function(dataCompany){
                var company=dataCompany.name;
                d3.json(server+"getDepartmentsByCompany/"+dataCompany.com_id,function(error,datasetDep){
                    datasetDep.forEach(function(dataDep){
                        var dep=dataDep.name;
                        var title=company+"_"+dep;
                        d3.json(server+"getValidatorsByDep/"+dataDep.bus_id,function(error,validators){
                            //to display either the validator if exists or a message "renseigner un validateur"
                                var nameOne="Renseigner un validateur";
                                var nameTwo="Renseigner un validateur";
                                var idOne ="no_id";
                                var idTwo="no_id";
                                var classNameOne="add-one-empty";
                                var classNameTwo="add-two-empty";
                                if (validators.length!==0){                                   
                                    validators.forEach(function(validator){
                                        if (validator.lvlone==true){                                           
                                            nameOne=validator.firstname+' '+validator.lastname;
                                            idOne=validator.id;
                                            classNameOne="add-one";
                                        }
                                        if (validator.lvltwo==true){
                                            nameTwo=validator.firstname+' '+validator.lastname;
                                            idTwo=validator.id;
                                            classNameTwo="add-two";
                                        }
                                    })
                                }
                                var one = guid();
                                var two = guid();
                                var form = guid();
                                $('<tr class="admin-list_' + title + '">' +
                                    '<td>' + company + '</td>' +
                                    '<td>' + dep + '</td>' +
                                    '<td  id="one-'+ one + '" class="'+classNameOne+'"><p id="'+idOne+'">'+nameOne+'</p><label title="add validator" class="val-one one-'+ one + '" ></label><img id="val-delete-one" src="img/delete.png" title="delete validator" height="20px"/></td>' +
                                    '<td  id="two-'+ two  + '" class="'+classNameTwo+'"><p id="'+idTwo+'">'+nameTwo+'</p><label title="add validator" class="val-two two-'+ two  + '"  ></label><img id="val-delete-two" src="img/delete.png" title="delete validator" height="20px"/></td>' +
                                    '</tr>').insertAfter($('.table-content'));                                
                                if (idOne==="no_id"){
                                    d3.select("#val-delete-one").style("display","none");
                                }
                                if (idTwo==="no_id"){
                                    d3.select("#val-delete-two").style("display","none");
                                }

                                //event to delete a validator if exists when clicking on the delete
                                d3.select("#val-delete-one").on("click",function(){
                                        var data={"level":"1","id":d3.select('#one-'+ one).select("p")[0][0].id};
                                        if (data.id!=="no_id"){
                                        d3.json(server +"deleteValidator", function(){
                                        }).header("Content-Type","application/json")
                                            .send("POST", JSON.stringify(data));
                                        d3.select('#one-'+ one).attr("class","add-one-empty");
                                        d3.select('#one-'+ one).selectAll("p").html("Renseigner un validateur").attr("id","no_id").style("display","block");
                                        d3.select('#one-'+ one).select("#val-delete-one").style("display", "none");
                                        }  

                                })
                                d3.select("#val-delete-two").on("click",function(){
                                        var data={"level":"2","id":d3.select('#two-'+ two).select("p")[0][0].id};
                                        if (data.id!=="no_id"){
                                        d3.json(server +"deleteValidator", function(){
                                        }).header("Content-Type","application/json")
                                            .send("POST", JSON.stringify(data));
                                            d3.select('#two-'+ two).attr("class","add-two-empty");
                                            d3.select('#two-'+ two).selectAll("p").html("Renseigner un validateur").attr("id","no_id").style("display","block");
                                            d3.select('#two-'+ two).select("#val-delete-two").style("display", "none");     
                                        }                                 
                                })


                                //event to add a new validator level one when clicking on the plus or update if exists
                                var selectone = d3.select('.one-'+one)
                                    .on("click", function(){
                                        // remove all forms and search bars already here on the page
                                        d3.selectAll(".none").remove();
                                        d3.selectAll(".row").remove();
                                        // display all hidden fields on the page
                                        d3.selectAll(".add-one").selectAll("p").style("display", "");
                                        d3.selectAll(".add-one-empty").selectAll("p").style("display", "");
                                        d3.selectAll(".add-two").selectAll("p").style("display", "");
                                        d3.selectAll(".add-two-empty").selectAll("p").style("display", "");
                                        d3.selectAll(".add-one").selectAll("label").style("display", "");
                                        d3.selectAll(".add-one-empty").selectAll("label").style("display", "");
                                        d3.selectAll(".add-two").selectAll("label").style("display", "");
                                        d3.selectAll(".add-two-empty").selectAll("label").style("display", "");
                                        d3.selectAll(".add-one").selectAll("#val-delete-one").style("display", "");
                                        d3.selectAll(".add-two").selectAll("#val-delete-two").style("display", "");

                                        //hide former message
                                        d3.select("#one-"+ one).select("p").style("display", "none");
                                        d3.select("#one-"+ one).select("label").style("display", "none");
                                        d3.select("#one-"+ one).select("#val-delete-one").style("display", "none");

                                        //add research bar
                                        ($('#one-'+ one)).append($('<div class="row" id="val-row">'+
                                            '<form id="search" onsubmit="return false">' +
                                                '<div id="val-search">'+
                                                    '<img src="/img/search01.png" width="30px" height="30px">'+
                                                '</div>'+                                  
                                                '<div id="val-input">'+
                                                    '<input type="text" name="search-terms" id="validator-search" placeholder="Rechercher une personne...">'+
                                                '</div>'+
                                                '<div id="val-valid">'+
                                                    '<button class="new_validator-one" value="Valider">Valider</button>'+
                                                '</div>'+
                                                '<div id="val-cancel-one">'+
                                                    '<img src="/img/crossDelete.png" width="15px" height="15px">'+
                                                '</div>'+
                                            '</form></div>'));
                                        var content;
                                        d3.json(server + "getPeopleByDepartment/"+ dataDep.bus_id, function (error, data) {
                                            data.forEach(getName);
                                            $('#validator-search').autocomplete({
                                                lookup: people,
                                                onSelect: function (suggestion) {
                                                    console.log(suggestion);
                                                    content=suggestion;
                                                }   
                                            });
                                        });

                                        //event to valiate change of validator when cicking on the button "valider"
                                        d3.select('.new_validator-one')
                                            .on("click", function(){
                                                if (content!==undefined && content!==null && content!==''){
                                                    console.log("Nouveau validateur: "+content.data.firstname+" "+content.data.lastname);
                                                    var data={"level":"1","firstname":content.data.firstname,"lastname":content.data.lastname};
                                                    if (d3.select('#one-'+ one).select("p")[0][0].id==="no_id"){ //no validator yet
                                                        d3.json(server +"saveValidator", function(){})
                                                        .header("Content-Type","application/json")
                                                        .send("POST", JSON.stringify(data));

                                                    }
                                                    else{
                                                         d3.json(server +"updateValidator", function(){})
                                                        .header("Content-Type","application/json")
                                                        .send("POST", JSON.stringify(data));
                                                    }
                                                    d3.select('#one-'+ one).attr("class","add-one");
                                                    d3.select('#one-'+ one).selectAll("p").html(content.data.firstname+" "+content.data.lastname).style("display","block").attr("id",content.data.per_id)
                                                    d3.select('#one-'+ one).select("label").style("display", "inline-block");
                                                    d3.select('#one-'+ one).selectAll(".row").remove();
                                                    d3.select('#one-'+ one).selectAll("#val-delete-one").style("display", "inline");
                                                }
                                            })

                                        //event to cancel the change when clicking on the image "cross"
                                        d3.select("#val-cancel-one").on("click", function(){
                                            // remove all forms and search bars already here on the page
                                            d3.select('#one-'+ one).selectAll("p").style("display","block");
                                            d3.select('#one-'+ one).select("label").style("display", "inline-block");
                                            if (d3.select('#one-'+ one).select("p")[0][0].id!=="no_id"){
                                                d3.select('#one-'+ one).select("#val-delete-one").style("display", "none");
                                            }
                                            d3.select('#one-'+ one).selectAll(".row").remove();
                                        });
                                    });

                                //event to add a new validator level two when clicking on the plus or update if exists
                                var selecttwo = d3.select('.two-'+two)
                                    .on("click", function(){
                                        d3.selectAll(".none").remove();
                                        d3.selectAll(".row").remove();
                                        // display all hidden fields on the page
                                        d3.selectAll(".add-one").selectAll("p").style("display", "");
                                        d3.selectAll(".add-one-empty").selectAll("p").style("display", "");
                                        d3.selectAll(".add-two").selectAll("p").style("display", "");
                                        d3.selectAll(".add-two-empty").selectAll("p").style("display", "");
                                        d3.selectAll(".add-one").selectAll("label").style("display", "");
                                        d3.selectAll(".add-one-empty").selectAll("label").style("display", "");
                                        d3.selectAll(".add-two").selectAll("label").style("display", "");
                                        d3.selectAll(".add-two-empty").selectAll("label").style("display", "");
                                        d3.selectAll(".add-one").selectAll("#val-delete-one").style("display", "");
                                        d3.selectAll(".add-two").selectAll("#val-delete-two").style("display", "");

                                        //hide former message
                                        d3.select("#two-"+ two).select("p").style("display", "none");
                                        d3.select("#two-"+ two).select("label").style("display", "none");
                                        d3.select("#two-"+ two).select("#val-delete-two").style("display", "none");

                                        //add research bar
                                        ($('#two-'+ two)).append($('<div class="row" id="val-row">'+
                                            '<form id="search" onsubmit="return false">' +
                                                '<div id="val-search">'+
                                                    '<img src="/img/search01.png" width="30px" height="30px">'+
                                                '</div>'+                                  
                                                '<div id="val-input">'+
                                                    '<input type="text" name="search-terms" id="validator-search" placeholder="Rechercher une personne...">'+
                                                '</div>'+
                                                '<div id="val-valid">'+
                                                    '<button class="new_validator-two" value="Valider">Valider</button>'+
                                                '</div>'+
                                                '<div id="val-cancel-two">'+
                                                    '<img src="/img/crossDelete.png" width="15px" height="15px">'+
                                                '</div>'+
                                            '</form></div>'));
                                        var content;
                                        d3.json(server + "getPeopleByCompany/" + dataCompany.com_id, function (error, data) {
                                            data.forEach(getName);
                                            $('#validator-search').autocomplete({
                                                lookup: people,
                                                onSelect: function (suggestion) {
                                                    content=suggestion;
                                                    console.log(suggestion);
                                                }
                                            })
                                        });
                                        //event to valiate change of validator when cicking on the button "valider"
                                        d3.select('.new_validator-two')
                                            .on("click", function(){
                                                if (content!==undefined && content!==null && content!==''){
                                                    console.log("Nouveau validateur: "+content.data.firstname+" "+content.data.lastname);
                                                    var data={"level":"2","firstname":content.data.firstname,"lastname":content.data.lastname};
                                                    if (d3.select('#two-'+ two).select("p")[0][0].id==="no_id"){ //no validator yet
                                                        d3.json(server +"saveValidator", function(){})
                                                        .header("Content-Type","application/json")
                                                        .send("POST", JSON.stringify(data));

                                                    }
                                                    else{
                                                         d3.json(server +"updateValidator", function(){})
                                                        .header("Content-Type","application/json")
                                                        .send("POST", JSON.stringify(data));
                                                    }
                                                    d3.select('#two-'+ two).attr("class","add-two");
                                                    d3.select('#two-'+ two).selectAll("p").html(content.data.firstname+" "+content.data.lastname).style("display","block").attr("id",content.data.per_id)
                                                    d3.select('#two-'+ two).select("label").style("display", "inline-block");
                                                    d3.select('#two-'+ two).selectAll(".row").remove();
                                                    d3.select('#two-'+ two).selectAll("#val-delete-two").style("display", "inline");
                                                }
                                            })

                                        //event to cancel the change when clicking on the image "cross"
                                        d3.select("#val-cancel-two").on("click", function(){
                                            // remove all forms and search bars already here on the page
                                            d3.select('#two-'+ two).selectAll("p").style("display","block");
                                            d3.select('#two-'+ two).select("label").style("display", "inline-block");
                                            if (d3.select('#two-'+ two).select("p")[0][0].id!=="no_id"){
                                                d3.select('#two-'+ two).select("#val-delete-two").style("display", "");
                                            }
                                            
                                            d3.select('#two-'+ two).selectAll(".row").remove();
                                        });
                                    });

                                    
                                    /** prepare autocomplete data*/
                                    var people = [];
                                    function getName(element, index, array){
                                        people.push({value: element.firstname + " " + element.lastname,data: element});
                                    }
                        });

                    });
                });
            });
        })
    }
}