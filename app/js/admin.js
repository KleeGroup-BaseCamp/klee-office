/**
 * Created by msalvi on 08/09/2016.
 */

"use strict";
// global variables
var	server= "http://localhost:3000/";

var adminControl = {
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

        // get all companies of Klee
        d3.json(server + "getAllCompanies", function (error, data){
            var side = ".left-side";

            // insert search bar at the corresponding side
            $("#search").insertAfter('#left');
            d3.select(".left-side").select("#search")
                .style("visibility", "hidden");
            if (step !== true){
                side = ".right-side";
                $("#search").insertAfter('#right');
            }

            // plot companies rects
            var rects = plotRects(side, data, "com_id", "company");
            if(step === true){
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
                            $('<p id="info-pole">Pas de pole pour cette societe, veuillez choisir un validateur de niveau 2.</p>').insertAfter(parent);
                        }
                        // plot dpts rects
                        var dptRects  =  plotRects(side, data, "pol_id", "dpt");

                        dptRects.on("click", function(data){
                            var departments = document.getElementsByClassName("dpt-rect");
                            // if rect are already there, remove them
                            Array.from(departments).forEach(function(element){
                                if(element.id !== data['pol_id'].toString() ){
                                    element.remove();
                                }
                            });

                            d3.select(".left-side").select("#search")
                                .style("visibility", "visible");
                            prepareForm()

                            d3.select("#pol_id")
                                .attr("value", data['pol_id']);
                            d3.json(server + "getPeopleByDepartment/" + data['pol_id'], function (error, data){
                                data.forEach(getName);
                                $('#validator-search').autocomplete({
                                    lookup: people,
                                    onSelect: function (suggestion) {
                                        setPeopleFields(suggestion);
                                    }
                                });
                            });
                        });
                    });
                });
            } else {
                rects.on("click", function(data) {
                    var company = document.getElementsByClassName("company-rect");
                    // if rect are already there, remove them
                    Array.from(company).forEach(function(element){
                        if(element.id !== data['com_id'].toString() ){
                            element.remove();
                        }
                    });
                    d3.select(".right-side").select("#search")
                        .style("visibility", "visible");
                    prepareForm();
                    d3.json(server + "getPeopleByCompany/" + data['com_id'], function (error, data) {

                        data.forEach(getName);
                        $('#validator-search').autocomplete({
                            lookup: people,
                            onSelect: function (suggestion) {
                                setPeopleFields(suggestion);
                                d3.select("#pol_id")
                                    .attr("value", suggestion.data['PolePolId']);
                            }
                        });
                    });
                });
            }
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
        var comp = document.getElementsByClassName("company-rect");;
        this.erase(dpt);
        this.erase(comp);
    },
    plotValidatorsList: function(){

        d3.json(server+  "getAllValidators", function(error, dataset){
            var i = 0;
            var couples = [];
            dataset.forEach(function(data){
                var nameOne = "Renseigner un validateur";
                var nameTwo = "Renseigner un validateur";
                var classOne = "add-one empty";
                var classTwo = "add-two empty";
                if (data.isValidatorLvlOne ===  1 &&
                    (data.firstname !== null || data.firstname !== undefined || data.firstname !== "")
                    && (data.lastname !== null || data.lastname !== undefined || data.lastname !== "" )){
                    nameOne = data.firstname + " " + data.lastname;
                    classOne = "add-one";
                }
                if (data.isValidatorLvlTwo ===  1 &&
                    (data.firstname !== null || data.firstname !== undefined || data.firstname !== "")
                    && (data.lastname !== null || data.lastname !== undefined || data.lastname !== "" )){
                    nameTwo = data.firstname + " " + data.lastname;
                    classTwo = "add-two";
                }
                function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                }
                var one = guid();
                var two = guid();
                var form = guid();
                var title = (data.company + data.pole).replace(/ /g, '_');
                if (couples.indexOf(title) < 0){
                    var valueOne = null;
                    var valueTwo = null;
                    if (data.isValidatorLvlOne === 1){
                        valueOne = data.id;
                    }
                    if (data.isValidatorLvlOne === 1){
                        valueTwo = data.id;
                    }

                    if (/*data.isValidatorLvlOne !== 0 || data.isValidatorLvlTwo !== 0*/true){
                        $('<tr class="admin-list ' + title + ' ">' +
                            '<td>' + data.company + '</td>' +
                            '<td>' + data.pole + '</td>' +
                            '<td  id="one-'+ one + '" class="'+ classOne + '"><p id="' +valueOne +' ">' + nameOne + '</p><label class="val-one one-'+ one + '" ></label></td>' +
                            '<td  id="two-'+ two  + '" class="'+ classTwo + '"><p id="' +valueTwo +' ">' + nameTwo + '</p><label class="val-two two-'+ two  + '"  ></label></td>' +
                            '</tr>').insertAfter($('.table-content'));
                    }
                    couples.push(title);

                }
                else {
                    if (data.isValidatorLvlOne !== 0 || data.isValidatorLvlTwo !== 0){
                        var cellNumber;
                        var className;
                        if(data.isValidatorLvlOne === 1){
                            // so add the lvl one validator
                            cellNumber = 2
                            className = "add-one";
                        }
                        if (data.isValidatorLvlTwo === 1){
                            // so add the lvl two validator
                            cellNumber = 3
                            className = "add-two";
                        }
                        if(cellNumber !== undefined){
                            var oldhtml = document.getElementsByClassName(title)[0]
                                .getElementsByTagName('td')[cellNumber].getElementsByTagName('p')[0]
                                .innerHTML;
                            document.getElementsByClassName(title)[0]
                                .getElementsByTagName('td')[cellNumber].getElementsByTagName('p')[0]
                                .innerHTML = oldhtml.replace("Renseigner un validateur", data.firstname + " " +data.lastname);
                            document.getElementsByClassName(title)[0]
                                .getElementsByTagName('td')[cellNumber]
                                .className = className;
                            document.getElementsByClassName(title)[0]
                                .getElementsByTagName('td')[cellNumber].getElementsByTagName('p')[0]
                                .id = data.id;
                        }
                    }
                }
                var selectone = d3.select('.one-'+one)
                    .on("click", function(){

                        // remove all forms and search bars already here
                        d3.selectAll(".none").remove();
                        d3.selectAll(".admin").remove();
                        // display all hidden fields
                        d3.selectAll(".add-one").selectAll("p").style("display", "");
                        d3.selectAll(".add-two").selectAll("p").style("display", "");
                        d3.selectAll(".add-one").selectAll("label").style("display", "");
                        d3.selectAll(".add-two").selectAll("label").style("display", "");

                        ($('#one-'+ one)).append($('<div class="admin"><form id="search" onsubmit="return false">' +
                            '<div id="label">'+
                            '<label for="search-terms" id="search-label">search</label>'+
                            '</div>'+
                            '<div id="input">'+
                            '<input type="text" name="search-terms" id="validator-search" placeholder="Rechercher une personne...">'+
                            '</div>'+
                            '</form></div>' +
                            ''));

                        d3.select("#one-"+ one).select("p").style("display", "none");
                        d3.select("#one-"+ one).select("label").style("display", "none");

                        $('<td class="none" id="form-' + form +'"> <form action="/updateValidateur" method="post">' +
                            '<input class="disabled-field" type="text" id="level" name="level" value="" readonly />'+
                            '<input class="disabled-field" type="text" id="pol_id" name="pol_id" value="" readonly />'+
                            '<input class="disabled-field" type="text" id="man_id" name="man_id" value="" readonly />'+
                            '<input class="disabled-field" type="text" id="firstname" name="firstname" value="" readonly />'+
                            '<input class="disabled-field" type="text" id="lastname" name="lastname" value="" readonly />'+
                            '<input class="disabled-field" type="text" id="mail" name="mail" value="" readonly />'+
                            '<input class="submit" id="#save-my-localisation" type="submit" value="Valider"/>'+
                            '</form></td>').insertAfter($('#two-'+ two));

                        d3.select('#form-'+form).style("display", 'block')
                            .style("width", "130px");

                        var url = "getPeopleByDepartment/";
                        var param = data['pol_id'];
                        var man_id = data.id;
                        d3.json(server + url + param, function (error, data) {
                            data.forEach(getName);
                            $('#validator-search').autocomplete({
                                lookup: people,
                                onSelect: function (suggestion) {
                                    setPeopleFields(suggestion);
                                    d3.select("#pol_id")
                                        .attr("value", suggestion.data['PolePolId']);
                                    d3.select("#level")
                                        .attr("value", "Niveau 1");
                                    if ( document.getElementsByClassName(title)[0]
                                            .getElementsByTagName('td')[2].getElementsByTagName('p')[0]
                                            .id !== null && document.getElementsByClassName(title)[0]
                                            .getElementsByTagName('td')[2].getElementsByTagName('p')[0]
                                            .id !== undefined && document.getElementsByClassName(title)[0]
                                            .getElementsByTagName('td')[2].getElementsByTagName('p')[0]
                                            .id !== "null "){
                                        d3.select("#man_id")
                                            .attr("value", document.getElementsByClassName(title)[0]
                                                .getElementsByTagName('td')[2]
                                                .getElementsByTagName('p')[0]
                                                .id);
                                    }
                                    else {
                                        d3.select("#man_id")
                                            .attr("value", man_id);
                                    }
                                }
                            });
                        });
                    });

                /**
                 * prepare autocomplete data
                 * @param element
                 * @param index
                 * @param array
                 */
                var people = [];
                function getName(element, index, array){
                    people.push({value: element.firstname + " " + element.lastname,
                        data: element});
                }

                /**
                 * set firstname lastname and mail fields of form
                 * @param suggestion data from autocomplete from people list
                 */
                function setPeopleFields(suggestion) {
                    d3.select("#firstname")
                        .attr("value", suggestion.data['firstname']);
                    d3.select("#lastname")
                        .attr("value", suggestion.data['lastname']);
                    d3.select("#mail")
                        .attr("value", suggestion.data['mail']);
                }

                d3.select('.two-'+two)
                    .on("click", function(){

                        var man_id = data.id;
                            // remove all forms and search bars already here
                            d3.selectAll(".none").remove();
                            d3.selectAll(".admin").remove();
                            // display all hidden fields
                            d3.selectAll(".add-one").selectAll("p").style("display", "");
                            d3.selectAll(".add-two").selectAll("p").style("display", "");
                            d3.selectAll(".add-one").selectAll("label").style("display", "");
                            d3.selectAll(".add-two").selectAll("label").style("display", "");

                            ($('#two-'+ two)).append($('<div class="admin"><form id="search" onsubmit="return false">' +
                                '<div id="label">'+
                                '<label for="search-terms" id="search-label">search</label>'+
                                '</div>'+
                                '<div id="input">'+
                                '<input type="text" name="search-terms" id="validator-search" placeholder="Rechercher une personne...">'+
                                '</div>'+
                                '</form></div>' +
                                ''));

                            d3.select("#two-"+ two).select("p").style("display", "none");
                            d3.select("#two-"+ two).select("label").style("display", "none");


                            $('<td class="none" id="form-' + form +'"> <form action="/updateValidateur" method="post">' +
                                '<input class="disabled-field" type="text" id="level" name="level" value="" readonly />'+
                                '<input class="disabled-field" type="text" id="man_id" name="man_id" value="" readonly />'+
                                '<input class="disabled-field" type="text" id="pol_id" name="pol_id" value="" readonly />'+
                                '<input class="disabled-field" type="text" id="com_id" name="com_id" value="" readonly />'+
                                '<input class="disabled-field" type="text" id="firstname" name="firstname" value="" readonly />'+
                                '<input class="disabled-field" type="text" id="lastname" name="lastname" value="" readonly />'+
                                '<input class="disabled-field" type="text" id="mail" name="mail" value="" readonly />'+
                                '<input class="submit" id="#save-my-valone" type="submit" value="Valider"/>'+
                                '</form></td>').insertAfter($('#two-'+ two));

                            d3.select('#form-'+form).style("display", 'block')
                                .style("width", "130px");
                            d3.json(server + "getPeopleByCompany/" + data['com_id'], function (error, data) {
                                data.forEach(getName);
                                $('#validator-search').autocomplete({
                                    lookup: people,
                                    onSelect: function (suggestion) {
                                        setPeopleFields(suggestion);
                                        d3.select("#pol_id")
                                            .attr("value", suggestion.data['pol_id']);
                                        d3.select("#com_id")
                                            .attr("value", suggestion.data['com_id']);
                                        d3.select("#level")
                                            .attr("value", "Niveau 2");
                                        if ( document.getElementsByClassName(title)[0]
                                                .getElementsByTagName('td')[3].getElementsByTagName('p')[0]
                                                .id !== null && document.getElementsByClassName(title)[0]
                                                .getElementsByTagName('td')[3].getElementsByTagName('p')[0]
                                                .id !== undefined  && document.getElementsByClassName(title)[0]
                                                .getElementsByTagName('td')[3].getElementsByTagName('p')[0]
                                                .id !== "null "){
                                            d3.select("#man_id")
                                                .attr("value", document.getElementsByClassName(title)[0]
                                                    .getElementsByTagName('td')[3].getElementsByTagName('p')[0]
                                                    .id);
                                        }
                                        else {
                                            d3.select("#man_id")
                                                .attr("value", man_id);
                                        }
                                    }
                                });
                            });
                    });
            });

        });
    }
}




