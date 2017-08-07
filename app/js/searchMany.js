//------------ script to manage the search of many persons --------

'use strict';
// global variables
//var	server= "http://localhost:3000/";
var	server= "http://local-map/";
var people = [];            //contains data about every person
var list_area=["N0","N1","N2","N3","N4","O1","O2","O3","O4","externe","aucun"];
var sitesExterne=["Issy-les-Moulineaux","Le Mans","Lyon","Bourgoin-Jailleux","Montpellier","Sur site client"];
var list_id={'Issy-les-Moulineaux':'Issy-les-Moulineaux_result','Le Mans':'le_mans_result','Lyon':'Lyon_result','Bourgoin-Jailleux':'Bourgoin-Jailleux_result','Montpellier':'Montpellier_result','Sur site client':'sur_site_client_result'}
var nbPeopleByArea = {}  // list to count the number of searched people by office area
var listPeopleWithoutOffice = [];

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

function getNoOfficePeople(dataSearchedPeople){
  var res=[];
  for (var i=0;i<dataSearchedPeople.length;i++){
      if (dataSearchedPeople[i][1] === "aucun"){
          res.push('<br/>'+dataSearchedPeople[i][0]);}
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
          .keyup(function() {
              if (!this.value) {
                  dataSearchedPeople.length=0;
                  console.log("Empty Search ? : " + dataSearchedPeople);
              }
          })
           // .on : don't navigate away from the field on tab when selecting an item
          .on( "keydown", function( event ) {
            //console.log("Type de $ : " + typeof $.ui.keyCode.TAB);
            if ( event.keyCode === Number($.ui.keyCode.TAB) && $( this ).autocomplete( "instance" ).menu.active ) {
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
              console.log("Autocomplete contenu : " + dataSearchedPeople);
              return false;
            }
          });

       });
      //console.log("Data envoyé : " + dataSearchedPeople);
      var click= document.getElementById("search-button");
  
      click.onclick = function(){plotNumberOfPeople(nbPeopleByArea, dataSearchedPeople);}
});



 // ----Function plotNumberOfPeople : shows the number of searched people group by maps on the navigation menu
function plotNumberOfPeople(nbPeopleByArea, dataSearchedPeople){
  //var click= document.getElementById("search-button");
  
 // click.onclick = function(){
    //console.log("plotNumberOfPeople : " + dataSearchedPeople);
    d3.select("#menu-withoutresult").style("display", "none");
    d3.select("#menu-newlocation").style("display", "none");
    d3.select("#menu-withresult").style("display", "");
    listPeopleWithoutOffice=getNoOfficePeople(dataSearchedPeople);

    var first_element_searched="";
    for (var i=0;i<list_area.length;i++){
        var area =list_area[i];  
        console.log("list area : " + list_area);      
        nbPeopleByArea[area]=getPeopleByArea(area,dataSearchedPeople).length;
        // if we have a searched person on this map
        if (nbPeopleByArea[area]>0){
          if (area==="externe"){
            for (var j=0;j<sitesExterne.length;j++){
              var site=sitesExterne[j];
              if (getPeopleBySite(site,dataSearchedPeople).length>0){
                if (first_element_searched===""){first_element_searched=site}
                console.log(getPeopleBySite(site,dataSearchedPeople));
                if(site === "Le Mans" ){
                  d3.select("#le_mans_result").text(site+"("+getPeopleBySite(site,dataSearchedPeople).length+")").style("color","red");
                }
                else if(site === "Sur site client" ){
                  d3.select("#sur_site_client_result").text(site+"("+getPeopleBySite(site,dataSearchedPeople).length+")").style("color","red");
                }
                else{
                  d3.select("#"+site+"_result").text(site+"("+getPeopleBySite(site,dataSearchedPeople).length+")").style("color","red");}
               }
            }
          }
          else{
              console.log("Là ya un result : " + area);
              d3.select("#"+area+"_withResult").text("Etage "+area+" ("+nbPeopleByArea[area]+")").style("color","red");
              if (first_element_searched===""){
                first_element_searched=area;
              console.log(first_element_searched)}
          }
        }
    } 
      d3.selectAll(".desk-maj").style("display","none");
      $("#text-default").html("<button id=\"removeSearch\"><a href=\"http://localhost:3000/\">Réinitialiser la recherche</a></button>");

      if (listPeopleWithoutOffice.length>0){
        $('<div class=noResultPeople><br/>Pas de bureau ('+listPeopleWithoutOffice.length+')<span class="noPlaceText">'+listPeopleWithoutOffice+'</div>').appendTo($('#text-default'));
        /*$('#noResultPeople').on({
          "click": function(){
            $(this).tooltip({ items: "#tt", content: "Displaying on click"});
            $(this).tooltip("open");
          },
          "mouseout": function() {      
            $(this).tooltip("disable");   
          }
        })*/
      }

      if (sitesExterne.indexOf(first_element_searched)!==-1){
        plotSite(first_element_searched)
      }
      else{
        if(first_element_searched==="aucun"){
          d3.select("#map-info").style("display","none");
        }else{
        plotEtage(first_element_searched);}      
        
      }
      plotResultClick(nbPeopleByArea, dataSearchedPeople);
 // };    
};
 // ----Function plotResult : display the map with the position and information about searched people when clicking on an area in the navigation menu
function plotResultClick(nbPeopleByArea, dataSearchedPeople){
  $('.list_etage').click(function(){
    var area = event.target.id;
    console.log(area)
    plotEtage(area)
  })
  $('.siteResult').click(function(){
    var site_id = event.target.id;
    var site=$('#'+site_id).html().split('(')[0]
    console.log(site)
    plotSite(site)
  })
}


function plotEtage(etage){
    d3.select("#map-info").style("display","");
		d3.select(".map-extern").style("display","none")

    var area = etage.split(/_/)[0]; //this.id="N3_withResult" --> area="N3"
    //if no map, show my map
    if (!mapControl.existMap) {
		  mapControl.mapName = area;
			mapControl.mapPlot(myData,area, false,function() {
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
      mapControl.mapPlot(myData,area,false, function() {
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
    }
}

function plotSite(site){
  var site_id=list_id[site];
  d3.select("#map-info").style("display","none");
	d3.select(".map-extern").style("display","")

  var dataSearchedPeopleBySite = [];

  if (site_id === "le_mans_result"){
        dataSearchedPeopleBySite=getPeopleBySite("Le Mans",dataSearchedPeople);
  }else if (site_id === "sur_site_client_result"){
        dataSearchedPeopleBySite=getPeopleBySite("Sur site client",dataSearchedPeople);
  }else {
        dataSearchedPeopleBySite=getPeopleBySite(site_id.split(/_/)[0],dataSearchedPeople);
  }

      d3.selectAll(".siteResult").style("font-weight","normal");
      d3.selectAll(".list_etage").style("font-weight","normal");
      d3.select("#"+site_id).style("font-weight","bold");

      var text_extern="<br/><ul>";
      for (var i=0;i<nbPeopleByArea.externe;i++){
        if (dataSearchedPeopleBySite[i] !== undefined){
        text_extern+=("<li>"+dataSearchedPeopleBySite[i][0]+"</li>");}
      }
      if (dataSearchedPeopleBySite.length === 0){
        var tooltip_ext = d3.select(".map-extern").html("Pas de résultat sur ce site ")
      }
      else{
        text_extern+="</ul>"
        d3.select("#map-info").style("display","none");
		    d3.select(".map-extern").style("display","").html(text_extern)
      }  
}


