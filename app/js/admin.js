/**
 * Created by msalvi on 08/09/2016.
 */

"use strict";
// global variables
var	server= "http://local-map/"

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
    }
}




