/**
 * Created by msalvi on 08/09/2016.
 */

"use strict";
// global variables
var	server= "http://localhost:3000/";
//var	server = "http://local-map/";

var adminControl = {
    alreadyOneSelected: false,
    plotList: function(step){
        /**
         * Plot rect with text inside
         * @param side
         * @param data
         * @param id
         * @returns {*}
         */
        function plotRects(side, data, id, name) {
            var rects = d3.select(side).select(".rects")
                .selectAll("div")
                .data(data)
                .enter().append("div")
                .style("width", "210px")
                .style("height", "28px")
                .style("background-color", "#9EC3D6")
                .style("margin-bottom", "10px")
                .style("text-align", "center")
                .style("border-radius", "3px")
                .style("cursor", "pointer")
                .attr("class", name+"-rect")
                .attr("id", function (d) {
                    return d[id];
                })
                .text(function (d) {
                    return d.name;
                });
            return rects;
        }

        /**
         * adjust visibility of form and height of container
         */
        function prepareForm() {
            d3.select("#val-form")
                .style("visibility", "visible");
            d3.select("#val-form").select("#pol_id")
                .style("visibility", "hidden")
                .style("height", "0px")
                .style("width", "0px");
            d3.select(".left-side")
                .style("height", "200px");
            d3.select(".right-side")
                .style("height", "200px");
        }

        /**
         * prepare autocomplete data
         * @param element
         * @param index
         * @param array
         */
        function getName(element, index, array){
            people.push({value: element.firstname + " " + element.lastname,
                data: element});
        }

        var people = [];

        // prepare autocomplete
        d3.json(server + "getPeople", function (error, data){
            data.forEach(getName);
            $('#validator-search').autocomplete({
                lookup: people,
                onSelect: function (suggestion) {
                    if (d3.select("#rect-"+suggestion.data.per_id).empty()){
                        var acRects =  d3.select(".people").append("div")
                            .style("width", "210px")
                            .style("height", "28px")
                            .style("background-color", "#9EC3D6")
                            .style("margin-bottom", "10px")
                            .style("text-align", "center")
                            .style("border-radius", "3px")
                            .style("cursor", "pointer")
                            .attr("class", "people-rect ");
                        acRects.attr("id", "rect-" + suggestion.data['per_id'])
                            .text(suggestion.data.firstname + " " + suggestion.data.lastname)
                            .on("click", function() {
                                if (adminControl.alreadyOneSelected === true) {
                                    acRects.style("background-color", "#9EC3D6");
                                }
                                d3.select("#person").text(
                                    suggestion.data.per_id
                                );
                                d3.select("#rect-" + suggestion.data['per_id']).style("background-color", "#9EB8E9");
                                adminControl.alreadyOneSelected = true;
                                d3.event.stopPropagation()

                            });

                        $('<div id ="remove-'+suggestion.data.per_id +'" class="remove"><p>&nbsp;</p></div>').insertAfter($('#rect-'+suggestion.data.per_id));
                        $('#remove-' + suggestion.data.per_id).click(function (event) {
                            d3.select('#remove-' + suggestion.data.per_id).remove();
                            d3.select('#rect-' + suggestion.data.per_id).remove();
                            d3.select('#mov-' + suggestion.data.per_id).remove();
                        });
                    }
                }
            });
        });

        // get all companies of Klee
        d3.json(server + "getAllCompanies", function (error, data){
            var side = ".left-side";

            // plot companies rects
            var rects = plotRects(side, data, "com_id", "company");
            rects.on("click", function(data){
                d3.json(server + "getDepartmentsByCompany/" + data['com_id'], function (error, data){
                    var companies  = document.getElementsByClassName("company-rect");
                    // if rect are already there, remove them
                    Array.from(companies).forEach(function(element){
                        element.remove();
                    });
                    // if no dpt in this company
                    if(data.length < 1){
                        var parent =  d3.select(side).select(".rects");
                        $('<p class="center" id="info-pole">Pas de pole pour cette societe, veuillez choisir un autre pole.</p>').insertAfter(parent);
                    }
                    // plot dpts rects
                    var dptRects  =  plotRects(side, data, "pol_id", "dpt");

                    dptRects.on("click", function(data){
                        var departments = document.getElementsByClassName("dpt-rect");
                        // if rect are already there, remove them
                        Array.from(departments).forEach(function(element){
                            element.remove();
                        });
                        d3.select(".left-side")
                            .style("height", "100%");
                        d3.select(".right-side")
                            .style("height", "100%");

                        d3.json(server + "getPeopleByDepartment/" + data['pol_id'], function (error, data) {
                            // remove people from data list if already added on the page with autocomplete
                            data.forEach(function(d){
                                if(!d3.select("#rect-"+ d.per_id).empty()){
                                    data.splice(data.indexOf(d ), 1);
                                }
                            });

                            var thisRect =   d3.select(side).select(".people")
                                .selectAll("div")
                                .data(data)
                                .enter().append("div")
                                .style("width", "210px")
                                .style("height", "28px")
                                .style("background-color", "#9EC3D6")
                                .style("margin-bottom", "10px")
                                .style("text-align", "center")
                                .style("border-radius", "3px")
                                .style("cursor", "pointer")
                                .attr("class", "people-rect ");
                            thisRect.attr("id", function (d) {
                                return "rect-" + d['per_id'];
                            })
                                .text(function (d) {
                                    return d.firstname + " " + d.lastname;
                                })
                                .on("click", function(dd){
                                    if (adminControl.alreadyOneSelected === true){
                                        d3.selectAll(".people-rect").style("background-color", "#9EC3D6");
                                    }
                                    d3.select("#person").text(
                                        dd.per_id
                                    );
                                    d3.select("#rect-"+dd['per_id']).style("background-color", "#9EB8E9");
                                    adminControl.alreadyOneSelected = true;
                                    d3.event.stopPropagation()

                                });
                            d3.select('html').on("click", function(a) {
                                d3.selectAll(".people-rect").style("background-color", "#9EC3D6");
                                adminControl.alreadyOneSelected = false;
                            });

                            data.forEach(function(elem){
                                $('<div id ="remove-'+elem.per_id +'" class="remove"><p>&nbsp;</p></div>').insertAfter($('#rect-'+elem.per_id));
                                $('#remove-' + elem.per_id).click(function (event) {
                                    d3.select('#remove-' + elem.per_id).remove();
                                    d3.select('#rect-' + elem.per_id).remove();
                                    d3.select('#mov-' + elem.per_id).remove();
                                });
                            });

                        });
                    });
                });
            });

        });
    },
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