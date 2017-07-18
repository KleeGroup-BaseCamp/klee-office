//------------ script to manage the search of many persons --------

'use strict';
// global variables
var	server= "http://localhost:3000/";
var people = [];            //contains data about every person
var list_area=["N0","N1","N2","N3","N4","O1","O2","O3","O4","externe"];
var nbPeopleByArea = {}  // list to count the number of searched people by office area

var myData=[d3.select("#personal-firstname")[0][0].textContent, d3.select("#personal-lastname")[0][0].textContent,"",""];
for (var i=0;i<list_area.length;i++){
  nbPeopleByArea[list_area[i]]=0;
}
var dataSearchedPeople=[];// [[name,desk,location,mail],,...]

function getNumberOfSearchedPeople(dataSearchedPeople){
    return dataSearchedPeople.length;
};

function getPeopleByArea(area,dataSearchedPeople){
    var res=[];
    for (var i=0;i<dataSearchedPeople.length;i++){
      if (area === "externe"){
        if (dataSearchedPeople[i][1]==="externe"){
          res.push(dataSearchedPeople[i]);}
      }
      else{
        if (dataSearchedPeople[i][1].split(/-/)[0]===area){
          res.push(dataSearchedPeople[i]);}
      }
    }
    return res;
}
function getPeopleBySite(site,dataSearchedPeople){
    var res=[];
    for (var i=0;i<dataSearchedPeople.length;i++){
      if (dataSearchedPeople[i][2]===site){
          res.push(dataSearchedPeople[i]);
      }
    }
    return res;
}

function getSearchedMaps(dataSearchedPeople){
  var res=[];
  for (var i=0;i<dataSearchedPeople.length;i++){
     var map=dataSearchedPeople[i][1].split(/-/)[0];
     if (map ===undefined){
       map="extern";}
     if (res.indexOf(map)===-1){ //if the element is not in the list yet
       res.push(map);
     }
  }
  return res;
}

function getSearchedDesks(dataSearchedPeople){ //searched desks without "noplace"
  var res=[];
    for (var i=0;i<dataSearchedPeople.length;i++){
        if (dataSearchedPeople[i][1] !== "noplace"){
          res.push(dataSearchedPeople[i][1]);}
    }
    return res
}

function getExternPeople(dataSearchedPeople){
  var res=[];
  for (var i=0;i<dataSearchedPeople.length;i++){
      if (dataSearchedPeople[i][1] === "externe"){
          res.push(dataSearchedPeople[i]);}
    }
    return res;
}

// call removeSearchElement anytime on this page
/*$(document).ready(function(){
    removeSearchElement();
});*/

// call * : launched for each call of searchMany.js
$(function(){
    // --- function getName : 
    function getName(element, index, array){
        people.push({value: element.firstname + " " + element.lastname, data: element});
    }

    // --- call getJSON : launched to create people
    $.getJSON('/getInfoPerson', function(data) {
        data.forEach(getName);
        //console.log(people);
      function split( val ) {
          return val.split( /;\s*/ );
       }
       function extractLast( term ) {
          return split( term ).pop();
       }
       function indexOfObjectsArray(array, attr, value) {
          for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
              return i;
            }
          }
          return -1;
       }

      // call search-terms : launched when user click on search button
       $('#search-terms')
           // .on : don't navigate away from the field on tab when selecting an item
          .on( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB && $( this ).autocomplete( "instance" ).menu.active ) {
              event.preventDefault();
            }
          })
          .autocomplete({
            minLength: 0,
            source: function( request, response ) {
              response( $.ui.autocomplete.filter( // delegate back to autocomplete, but extract the last term
                people, extractLast( request.term ) ) );
            },
            focus: function() { // prevent value inserted on focus
              return false;
            },
            select: function( event, ui ) {
              var terms = split( this.value );
              var nbSearch=terms.length;
              terms.pop();                     // remove the current input
              terms.push( ui.item.value );     // add the selected item
              terms.push( "" );                // add placeholder to get the semicolon-and-space at the end
              this.value = terms.join( "; " );
              var indice = indexOfObjectsArray(people, 'value', terms[nbSearch-1]); // get the index in the array people of the searched person
              var is_already_on_list =false;
              for (var i=0;i<dataSearchedPeople.length;i++){
                if (dataSearchedPeople[i][0]===people[indice].value){  //check if it is already on the list or not
                  is_already_on_list=true;
                }
              }
              if (is_already_on_list===false){
                if ((people[indice].data.site === undefined) || (people[indice].data.deskname === undefined)){  //check if the format of the desk is valid. If invalid, the desk number is defined as "noplace"
                  dataSearchedPeople.push([people[indice].value,"noplace","nolocation",people[indice].data.mail]);}
                else{ 
                dataSearchedPeople.push([people[indice].value,people[indice].data.deskname,people[indice].data.site,people[indice].data.mail]);}
              }
              console.log(dataSearchedPeople)
              return false;
            }
          });

       });

      plotNumberOfPeople(nbPeopleByArea, dataSearchedPeople);
});



 // ----Function plotNumberOfPeople : shows the number of searched people group by maps on the navigation menu
function plotNumberOfPeople(nbPeopleByArea, dataSearchedPeople){
  var click= document.getElementById("search-button");
  click.onclick = function(){
    d3.selectAll("#etages_withoutResult").style("visibility", "hidden")
					.style("width", "0px")
					.style("height", "0px")
          .style("padding","0px");
    d3.selectAll("#etages_withResult").style("visibility", "visible")
          .style("width","auto")
          .style("height","auto")
          .style("padding","20px");
    var first_area_not_empty="";
    for (var i=0;i<list_area.length;i++){
        var area =list_area[i];        
        nbPeopleByArea[area]=getPeopleByArea(area,dataSearchedPeople).length;
        if (nbPeopleByArea[area]>0){
          console.log(area);
          if (area==="externe"){
            var sitesExterne=["Issy-les-Moulineaux","Le Mans","Lyon","Bourgoin-Jailleux","Montpellier","sur site client"];
            for (var j=0;j<sitesExterne.length;j++){
              var site=sitesExterne[j];
              if (getPeopleBySite(site,dataSearchedPeople).length>0){
                console.log(getPeopleBySite(site,dataSearchedPeople));
                d3.select("#"+site).text(site+"("+getPeopleBySite(site,dataSearchedPeople).length+")").style("color","red");
              }
            }
              //d3.select(".ext").text("Personnes externe(s) : "+nbPeopleByArea.externe);
              if (first_area_not_empty===""){first_area_not_empty="externe"}
          }
          else{
              d3.select("#"+area+"_withResult").text("Etage "+area+" ("+nbPeopleByArea[area]+")").style("color","red");
              if (first_area_not_empty===""){first_area_not_empty=area}
          }
        }
    } 
      d3.select("#button-localization").style("visibility","hidden").style("width","0px").style("height","0px");
      d3.select("#title-default").html("MODE Recherche de personnes");
      d3.select("#text-default").html("Vous avez recherché "+getNumberOfSearchedPeople(dataSearchedPeople)+" personne(s)"
      +"<br/><button id=\"removeSearch\"><a href=\"http://localhost:3000/\">Réinitialiser la recherche</a></button>");
      plotFirstMap(nbPeopleByArea,dataSearchedPeople,first_area_not_empty);
      plotResultClick(nbPeopleByArea, dataSearchedPeople);
  };    
};

function plotFirstMap(nbPeopleByArea,dataSearchedPeople,first_area_not_empty){
    //Load the first result
    console.log("first arear not empty" +first_area_not_empty)
    mapControl.eraseMap();
    if (first_area_not_empty==="externe"){
      d3.select("#whole-map").style("visibility","hidden").style("height","0px");
      d3.select("#legend").style("visibility","hidden").style("height","0px");
      d3.select(".tooltip_ext_map").style("visibility","visible");
      var dataSearchedPeopleExtern=getExternPeople(dataSearchedPeople);
      var text_extern="<h2> Personne(s) externe(s) :</h2><br/><br/><ul>";
      for (var i=0;i<nbPeopleByArea.externe;i++){text_extern+=("<li>"+dataSearchedPeopleExtern[i][0]+" -- "+dataSearchedPeopleExtern[i][2]+"</li>");}
      text_extern+="</ul>"
      var tooltip_ext = d3.select(".tooltip_ext_map");
      tooltip_ext.html(text_extern)
                  .style("position","relative")
                  .style("padding","20px")
                  .style("height","600px");
        tooltip_ext.transition()
                  .duration(200)
                  .style("opacity", .95)
                  .style("z-index", 20);
        event.stopPropagation(); 
    }
    else{
      //d3.select(".tooltip_ext_map").style("visibility","hidden").style("height","0px");
      d3.select("#legend").style("visibility","visible").style("height","600px");
		  d3.select("#whole-map").style("visibility","visible").style("height","600px");
      var area =first_area_not_empty;
      //if no map, show my map
      if (!mapControl.existMap) {
		    mapControl.mapName = area;
			  mapControl.mapPlot(myData,area,function() {
          var dataSearchedPeopleByArea=getPeopleByArea(mapControl.mapName,dataSearchedPeople);
          var xPosition,yPosition;
          var table;
          for (var k=0;k<nbPeopleByArea[mapControl.mapName];k++){
            table = d3.select("#tables").select("#" + dataSearchedPeopleByArea[k][1]);
            //console.log(table);
            var xPosition = table.select("rect").attr("x")-5;
					  var yPosition = table.select("rect").attr("y")-22;
            //to load pin on people position
            table.append("image")
                  .attr("xlink:href", "./img/pin_final.png")
                  .attr("width", "20")
                  .attr("height", "35")
                  .attr("x", xPosition)
                  .attr("y", yPosition);
          }
        });   
			mapControl.existMap = true;
		  }
		  // if other map, delete and show my map
		  else if (mapControl.mapName !== area) {
			  d3.select(".map").select("svg").remove();
		  	mapControl.mapName = area;              
        mapControl.mapPlot(myData,area, function() {
          var dataSearchedPeopleByArea=getPeopleByArea(mapControl.mapName,dataSearchedPeople);
          var xPosition,yPosition;
          var table;
          for (var k=0;k<nbPeopleByArea[mapControl.mapName];k++){
            table = d3.select("#tables").select("#" + dataSearchedPeopleByArea[k][1]);
            var xPosition = table.select("rect").attr("x")-5;
				  	var yPosition = table.select("rect").attr("y")-22;
            //to load pin on people position
            table.append("image")
                  .attr("xlink:href", "./img/pin_final.png")
                  .attr("width", "20")
                  .attr("height", "35")
                  .attr("x", xPosition)
                  .attr("y", yPosition);
          }       
        });
      }
      $('<h1 class='+area+'> Etage <br/>'+area+'</h1>').prependTo($('#map-name'));  
    }
}





 // ----Function plotResult : display the map with the position and information about searched people when clicking on an area in the navigation menu
function plotResultClick(nbPeopleByArea, dataSearchedPeople){
  $('.list_etage').click(function(){
    d3.select(".tooltip_ext_map").style("visibility","hidden").style("height","0px");
		d3.select("#whole-map").style("visibility","visible").style("height","600px");
    d3.select("#legend").style("visibility","visible").style("height","600px");
    var area = this.id.split(/_/)[0]; //this.id="N3_withResult" --> area="N3"
    mapControl.eraseMap();
    //if no map, show my map
    if (!mapControl.existMap) {
		  mapControl.mapName = area;
			mapControl.mapPlot(myData,area, function() {
        var dataSearchedPeopleByArea=getPeopleByArea(mapControl.mapName,dataSearchedPeople);
        var xPosition,yPosition;
        var textToPlot="";
        var table;
        for (var k=0;k<nbPeopleByArea[mapControl.mapName];k++){
          table = d3.select("#tables").select("#" + dataSearchedPeopleByArea[k][1]);
          //console.log(table);
          var xPosition = table.select("rect").attr("x")-5;
					var yPosition = table.select("rect").attr("y")-22;
          //to load pin on people position
          table.append("image")
                  .attr("xlink:href", "./img/pin_final.png")
                  .attr("width", "20")
                  .attr("height", "35")
                  .attr("x", xPosition)
                  .attr("y", yPosition);
        }
      });   
			mapControl.existMap = true;
		}
		// if other map, delete and show my map
		else if (mapControl.mapName !== area) {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = area;              
      mapControl.mapPlot(myData,area, function() {
        var dataSearchedPeopleByArea=getPeopleByArea(mapControl.mapName,dataSearchedPeople);
        var xPosition,yPosition;
        var textToPlot="";
        var table;
        for (var k=0;k<nbPeopleByArea[mapControl.mapName];k++){
          table = d3.select("#tables").select("#" + dataSearchedPeopleByArea[k][1]);
          //console.log(table);
          var xPosition = table.select("rect").attr("x")-5;
					var yPosition = table.select("rect").attr("y")-22;
          //to load pin on people position
          table.append("image")
                  .attr("xlink:href", "./img/pin_final.png")
                  .attr("width", "20")
                  .attr("height", "35")
                  .attr("x", xPosition)
                  .attr("y", yPosition);
        }       
      });
    }
    $('<h1 class='+area+'> Etage <br/>'+area+'</h1>').prependTo($('#map-name'));  
  })
  $('.ext').click(function(){
      d3.select("#whole-map").style("visibility","hidden").style("height","0px");
      d3.select("#legend").style("visibility","hidden").style("height","0px");
      d3.select(".tooltip_ext_map").style("visibility","visible");
      var dataSearchedPeopleExtern=getExternPeople(dataSearchedPeople);
      var text_extern="<h2> Personne(s) externe(s) :</h2><br/><br/><ul>";
      for (var i=0;i<nbPeopleByArea.externe;i++){text_extern+=("<li>"+dataSearchedPeopleExtern[i][0]+"</li>");}
      text_extern+="</ul>"
        var tooltip_ext = d3.select(".tooltip_ext_map");
        tooltip_ext.html(text_extern)
                  .style("position","relative")
                  .style("padding","20px")
                  .style("height","600px");
        tooltip_ext.transition()
                  .duration(200)
                  .style("opacity", .95)
                  .style("z-index", 20);
        event.stopPropagation(); 
  })
}
/*
function plotResultExtern(nbPeopleByArea,dataSearchedPeople){
  var dataSearchedPeopleExtern=getExternPeople(dataSearchedPeople);
  var text_extern="";
  for (var i=0;i<nbPeopleByArea.externe;i++){text_extern+=(dataSearchedPeopleExtern[i][0])+"<br/>";}
    console.log(text_extern);
    d3.select(".ext")
    .style("cursor", "pointer")
    .on("mouseover", function(){
      var tooltip_ext = d3.select(".tooltip_ext");
      console.log("tooltip");
      tooltip_ext.html(text_extern)
        .style("top", "90px")
        .style("left","35px");
      tooltip_ext.transition()
                  .duration(200)
                  .style("opacity", .95)
                  .style("z-index", 20);
      event.stopPropagation();                                    
      $("html").click(function () {
        tooltip_ext.transition()
                    .duration(500)
                    .style("opacity", 0)
                    .style("z-index", -1);})


    })                         
};*/

    /* NOT USED ANYMORE  // ----Function plotNumberOfPeople : shows on the page the number of searched people group by maps --> example nbPeopleByArea={n0: 0, n1: 0, n2: 0, n3: 2, n4: 0, o2: 1, o3: 0, o4: 0, externe: 0}
function plotNumberOfPeople(nbPeopleByArea, dataSearchedPeople){
                // -- update the list nbPeopleByArea with the data of each searched person -- 
                for (var i=0;i<list_area.length;i++){
                  var area=list_area[i];
                  nbPeopleByArea[area]=getPeopleByArea(area,dataSearchedPeople).length
                  var people_same_area=""; 
                  if (nbPeopleByArea[area]>0){
                      switch (area){
                        case "externe":
                          console.log(getPeopleByArea(area,dataSearchedPeople));
                          var text_e="";
                          var list_extern=getExternPeople(dataSearchedPeople);
                          for (var f=0;f<list_extern.length;f++){
                            text_e+=list_extern[f][0]+"<br/>";
                          }
                          var div_e = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          d3.select("#noplace-personnes")
                            .text("- " + nbPeopleByArea.externe + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                            div_e.transition()		
                                .duration(200)		
                                .style("opacity", .9);		
                            div_e.html(text_e)
                                .style("position","absolute")
                                .style("left", d3.event.pageX + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","250px");})
                          .on("mouseout", function(d) {		
                              div_e.transition().duration(500).style("opacity", 0);})	
                        break;
                        case "N0":
                          var div_N0 = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          var text_N0="";
                          people_same_area=getPeopleByArea(area,dataSearchedPeople);
                          for (var l=0;l<people_same_area.length;l++){
                            text_N0+=people_same_area[l][0];
                            text_N0+="<br/>";
                          } 
                          d3.select("#"+area+"-personnes")
                            .text("- " + nbPeopleByArea[area] + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                              div_N0.transition()		
                                .duration(200)		
                                .style("opacity", .9);		
                              div_N0.html(text_N0)
                                .style("position","absolute")
                                .style("left", d3.event.pageX-10 + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","auto");})
                            .on("mouseout", function(d) {		
                              div_N0.transition().duration(500).style("opacity", 0);})
                        break;                        
                        case "N1":
                          var div_N1 = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          var text_N1="";
                          people_same_area=getPeopleByArea(area,dataSearchedPeople);
                          for (var l=0;l<people_same_area.length;l++){
                            text_N1+=people_same_area[l][0];
                            text_N1+="<br/>";
                          } 
                          d3.select("#"+area+"-personnes")
                            .text("- " + nbPeopleByArea[area] + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                              div_N1.transition()		
                                .duration(200)		
                                .style("opacity", .9);		
                              div_N1.html(text_N1)
                                .style("position","absolute")
                                .style("left", d3.event.pageX-10 + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","auto");})
                            .on("mouseout", function(d) {		
                              div_N1.transition().duration(500).style("opacity", 0);})
                        break;
                        case "N2":
                          var div_N2 = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          var text_N2="";
                          people_same_area=getPeopleByArea(area,dataSearchedPeople);
                          for (var l=0;l<people_same_area.length;l++){
                            text_N2+=people_same_area[l][0];
                            text_N2+="<br/>";
                          }
                          d3.select("#"+area+"-personnes")
                           .text("- " + nbPeopleByArea[area] + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                                div_N2.transition()		
                                .duration(200)		
                                .style("opacity", .9);		
                                div_N2.html(text_N2)
                                .style("position","absolute")
                                .style("left", d3.event.pageX-10 + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","auto");})
                            .on("mouseout", function(d) {		
                              div_N2.transition().duration(500).style("opacity", 0);})
                        break;
                        case "N3":
                          var div_N3 = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          var text_N3="";
                          people_same_area=getPeopleByArea(area,dataSearchedPeople);
                          for (var l=0;l<people_same_area.length;l++){
                            text_N3+=people_same_area[l][0];
                            text_N3+="<br/>";
                          } 
                          d3.select("#"+area+"-personnes")
                            .text("- " + nbPeopleByArea[area] + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                              div_N3.transition()		
                                .duration(200)		
                                .style("opacity", .9);		
                              div_N3.html(text_N3)
                                .style("position","absolute")
                                .style("left", d3.event.pageX-10 + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","auto");})
                            .on("mouseout", function(d) {		
                              div_N3.transition().duration(500).style("opacity", 0);})
                        break;
                        case "N4":
                          var div_N4 = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          var text_N4="";
                          people_same_area=getPeopleByArea(area,dataSearchedPeople);
                          for (var l=0;l<people_same_area.length;l++){
                            text_N4+=people_same_area[l][0];
                            text_N4+="<br/>";
                          }
                          d3.select("#"+area+"-personnes")
                           .text("- " + nbPeopleByArea[area] + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                                div_N4.transition()		
                                .duration(200)		
                                .style("opacity", .9);		
                                div_N4.html(text_N4)
                                .style("position","absolute")
                                .style("left", d3.event.pageX + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","auto");})
                            .on("mouseout", function(d) {		
                              div_N4.transition().duration(500).style("opacity", 0);})
                        break; 
                        case "O1":
                          var div_O1 = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          var text_O1="";
                          people_same_area=getPeopleByArea(area,dataSearchedPeople);
                          for (var l=0;l<people_same_area.length;l++){
                            text_O1+=people_same_area[l][0];
                            text_O1+="<br/>";
                          } 
                          d3.select("#"+area+"-personnes")
                            .text("- " + nbPeopleByArea[area] + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                              div_O1.transition()		
                                .duration(200)		
                                .style("opacity", .9);		
                              div_O1.html(text_O1)
                                .style("position","absolute")
                                .style("left", d3.event.pageX-10 + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","auto");})
                            .on("mouseout", function(d) {		
                              div_O1.transition().duration(500).style("opacity", 0);})
                        break;                       
                        case "O2":
                          var div_O2 = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          var text_O2="";
                          people_same_area=getPeopleByArea(area,dataSearchedPeople);
                          for (var l=0;l<people_same_area.length;l++){
                            text_O2+=people_same_area[l][0];
                            text_O2+="<br/>";
                          } 
                          d3.select("#"+area+"-personnes")
                            .text("- " + nbPeopleByArea[area] + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                              div_O2.transition()		
                                .duration(200)		
                                .style("opacity", .9);		
                              div_O2.html(text_O2)
                                .style("position","absolute")
                                .style("left", d3.event.pageX-10 + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","auto");})
                            .on("mouseout", function(d) {		
                              div_O2.transition().duration(500).style("opacity", 0);})
                        break;
                        case "O3":
                          var div_O3 = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          var text_O3="";
                          people_same_area=getPeopleByArea(area,dataSearchedPeople);
                          for (var l=0;l<people_same_area.length;l++){
                            text_O3+=people_same_area[l][0];
                            text_O3+="<br/>";
                          }
                          d3.select("#"+area+"-personnes")
                           .text("- " + nbPeopleByArea[area] + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                                div_O3.transition()		
                                .duration(150)		
                                .style("opacity", .9);		
                                div_O3.html(text_O3)
                                .style("position","absolute")
                                .style("left", d3.event.pageX-10 + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","auto");})
                            .on("mouseout", function(d) {		
                              div_O3.transition().duration(500).style("opacity", 0);})
                        break;
                        case "O4":
                          var div_O4 = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
                          var text_O4="";
                          people_same_area=getPeopleByArea(area,dataSearchedPeople);
                          for (var l=0;l<people_same_area.length;l++){
                            text_O4+=people_same_area[l][0];
                            text_O4+="<br/>";
                          }
                          d3.select("#"+area+"-personnes")
                           .text("- " + nbPeopleByArea[area] + " -").style("color", "	rgb(20,200,20)")
                            .on("mouseover", function(d) {		
                                div_O4.transition()		
                                .duration(200)		
                                .style("opacity", .9);		
                                div_O4.html(text_O4)
                                .style("position","absolute")
                                .style("left", d3.event.pageX + "px")
											          .style("top", d3.event.pageY + "px")
                                .style("height","auto")
                                .style("width","auto");})
                            .on("mouseout", function(d) {		
                              div_O4.transition().duration(500).style("opacity", 0);})
                        break;                        
                      }	
                  }
                }
                plotResult(nbPeopleByArea, dataSearchedPeople);
       };  
};*/

// NOT USED ANYMORE ------Function plotResult : display the location of searched people on the maps -----
/*function plotResult(nbPeopleByArea, dataSearchedPeople){ 
  var global_table=d3.selectAll("#tables");
  var mapSearch = getSearchedMaps(dataSearchedPeople); //list of office areas of searched people --> example : mapSearch=[O2,N3] 
  for (var i=0;i<mapSearch.length;i++){
      var people_same_area=getPeopleByArea(mapSearch[i],dataSearchedPeople);   
      for (var k=0;k<people_same_area.length;k++){
        var table=global_table.select("#" + dataSearchedPeople[k][1]);   //example :<g  id="N2-A-01"><rect fill="#f7f73b" fill-opacity="0.66" width="25.52841" height="12.577848" x="27.785971" y="249.75424" /></g>
        table.append("image")
            .attr("xlink:href", "./img/pin_final.png")
            .attr("width", "30")
            .attr("height", "50")
            .attr("x",table.select("rect").attr("x") -10)
            .attr("y",table.select("rect").attr("y") -40);
      }
    }*/

/* NOT USED ANYMORE
  console.log(mapSearch);
       //call result : display a map (user must have clicked on it) with the results of the search
      $('.result').click(function(){
         var buro = this.id.split(/-/);
         var j = mapSearch.indexOf(buro[0]);
         if(!mapControl.existMap) {
                        // erase all maps' overview
          mapControl.eraseMap();
                      d3.select("#map-show")
                                   .style("visibility", "visible")
                                   .style("width", "100%")
                                   .style("height", "100%");
                      mapControl.mapName = buro[0]; //Area targetted exemple "N3"
                      d3.select("#etage")
                          .append("text")
                          .text("Etage "+mapControl.mapName);
                      if (mapControl.mapName !=="noplace"){
                        if (mapSearch[j+1] === "noplace"){
                          j = (j+1) % mapSearch.length;
                        }
                        console.log("MapName loaded : " + mapControl.mapName);
                        console.log("J = " + j);
                        // To load the map with all the data
                        mapControl.mapPlot(mapControl.mapName, false, function() {
                          var data_area=getPeopleByArea(mapControl.mapName,dataSearchedPeople);
                          var xPosition,yPosition;
                          var textToPlot="";
                          var table;
                          for (var k=0;k<nbPeopleByArea[mapControl.mapName];k++){
                            table = d3.select("#tables")
                                          .select("#" + data_area[k][1]);
                            console.log(table);
                            var xPosition = table.select("rect").attr("x")-10;
											      var yPosition = table.select("rect").attr("y")-40;
                            //to load pin on people position
                            table.append("image")
                                      .attr("xlink:href", "./img/pin_final.png")
                                      .attr("width", "30")
                                      .attr("height", "50")
                                      .attr("x", xPosition)
                                      .attr("y", yPosition);
                            textToPlot+=("<b>"+data_area[k][0] + "</b> : "+ data_area[k][2]+" : "+data_area[k][1]+ " - " +data_area[k][3] +  "<br/>")
                            //yPosition += $(window).scrollTop(); // get scroll pixels to correct tooltip's yPostion
                          }
                            //To load tooltip with data on persons
                            var tooltip = d3.select(".tooltip_map");
										        tooltip.html(textToPlot)
											                  .style("position", "relative")
                                        .style("top","0%")
                                        .style("left","0%")
										        tooltip.transition()
											                  .duration(200)
											                  .style("opacity", .9)
											                  .style("z-index", 20);
                            event.stopPropagation();
                            $("html").click(function (event) {
                                  event.stopPropagation();})
                            $(".tooltip").click(function () {
							                      div.transition()
								                        .duration(500)
								                        .style("opacity", 0)
								                        .style("z-index", -1);})     

                              //to load tooltip result about extern people
                            var text_extern="";
                            for (var i=0;i<nbPeopleByArea.externe;i++){text_extern+=(getExternPeople(dataSearchedPeople)[i][0])+"<br/>";}
                            d3.select("#extern-result")
                                  .text(nbPeopleByArea.externe + " Personne(s) externe(s)")
                                  .style("cursor", "pointer")
                                  .on("click", function(){
                                   // console.log("Bureau : " + d3.event.target.parentNode.id);
                            if (nbPeopleByArea.externe > 0){
                                    var xPos = event.X,
                                      yPos = event.Y;
                                    var infobulle = d3.select(".tooltip_ext");
                                        // get scroll pixels to correct tooltip's yPostion
                                      yPos += $(window).scrollTop();
                                      infobulle.html(text_extern)
                                          .style("position","relative")
                                          .style("left", "50%")
                                          .style("top", "100%")
                                          .style("width","auto")
                                          .style("height","auto");
                                      infobulle.transition()
                                          .duration(200)
                                          .style("opacity", .9)
                                          .style("z-index", 20);
                                     
                                      $("html").click(function () {
                                          infobulle.transition()
                                            .duration(500)
                                            .style("opacity", 0)
                                            .style("z-index", -1);})

                                      event.stopPropagation();
                                   }
                                  });
                          });
                          mapControl.existMap = true;
                        }
  
                       // call search-back : display the next map with results ("suivant" button)
                          $('#search-back').click(function(){
                              j= ( (j+1) % (mapSearch.length) );
                              //console.log("j = " + j);
                              console.log("Current map : " + mapSearch[j]);                                  
                              if(mapSearch[j] !== "extern"){
                                d3.select(".map").select("svg").remove();
                                mapControl.existMap = false;
                                mapControl.mapName = mapSearch[j] ;
                                // To show the title stair - example : "Etage N4"
                                d3.select("#etage").data(["Etage "+mapControl.mapName]).text(function(d) { return d; });

                                mapControl.mapPlot(mapSearch[j], false, function() {
                                  var data_area=getPeopleByArea(mapSearch[j],dataSearchedPeople);
                                  var textToPlot="";
                                  var table;
                                  for (var k=0;k<nbPeopleByArea[mapControl.mapName];k++){ //all the searched people located in this area (mapSearch[j])
                                    var xPosition,yPosition;
                                    table = d3.select("#tables")
                                                      .select("#" + data_area[k][1]);
                                    var xPosition = table.select("rect").attr("x")-10;
											              var yPosition = table.select("rect").attr("y")-40;
                                    //yPosition += $(window).scrollTop(); // get scroll pixels to correct tooltip's yPostion
                                    table.append("image")
                                                .attr("xlink:href", "./img/pin_final.png")
                                                .attr("width", "30")
                                                .attr("height", "50")
                                                .attr("x", xPosition)
                                                .attr("y", yPosition);
                                    textToPlot+=("<b>"+data_area[k][0] + "</b> : "+ data_area[k][2]+" : "+data_area[k][1]+ " - " +data_area[k][3] +  "<br/>");
                                  }
                                    d3.select("#extern-result")
                                       .text(nbPeopleByArea.externe + " Personne(s) externe(s)");
                                    mapControl.existMap = true;
                                  var tooltip = d3.select(".tooltip_map");
										              tooltip.html(textToPlot)
											                  .style("position", "relative")
                                        .style("top","0%")
                                        .style("left","0%")
										              tooltip.transition()
											                  .duration(200)
											                  .style("opacity", .9)
											                  .style("z-index", 20);
                                  event.stopPropagation();
                                  $("html").click(function (event) {
                                    event.stopPropagation();})
                                  $(".tooltip").click(function () {
							                      div.transition()
								                        .duration(500)
								                        .style("opacity", 0)
								                        .style("z-index", -1);}) 

                                  if (mapSearch[j+1] === "noplace"){
                                          j = (j+1) % mapSearch.length;
                                  }
                                  
                                });                          
                              }       
                          });
         }
      });        
};*/

// ------------------------------- //

/*function removeSearchElement(){
  $("#cross-delete").click(function(){
         console.log("CLICK SUR LA CROIX");
         $("#search-terms").val("");
         dataSearchedPeople.length=0;
         
         var k;
         console.log("DataPerson : " + dataSearchedPeople);
         console.log("nbPeopleByArea : " + nbPeopleByArea);
         console.log("Etage : " + nbPeopleByArea.length);
        
         for (var k=0;k<nbPeopleByArea[list_area[k]];k++){
                            table = d3.select("#tables")

                                        .select("#" + nbPeopleByArea[list_area[k]])
                                        .remove("image");
                                       // console.log("Etage : " + nbPeopleByArea[list_area[k]]);
                                      console.log("TOTOTO");}
          nbPeopleByArea.length = 0;
                            
                          })
   // })
}*/

