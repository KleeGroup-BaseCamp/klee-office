// -------- edit by almorin -------


//------------ script to manage the search of many persons --------

'use strict';
// call * : launched for each call of searchMany.js
$(function(){
    var people = [];            //contains data about every person
   // var listePlateau =[];       // contains the office areas of searched people
    var listeBureaux = [];      // contains the office location and desk number of searched people
    var listeSplitID = [];      // contains the desk number of searched people
    var personneParPlateau = {  // list to count the number of searched people by office area
      n0: 0, n1: 0, n2: 0, n3: 0, n4: 0, o2: 0, o3: 0, o4: 0, externe: 0
    }
    var listeIdentifiants=[];

    // --- function getName : 
    function getName(element, index, array){
        people.push({value: element[1].cn[0], data: element[1]});
    }

    // --- call getJSON : launched to create people
    $.getJSON('/people', function(data) {
        data.forEach(getName);
        console.log(people);
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
              var nbSearch = terms.length;
              terms.pop();                     // remove the current input
              terms.push( ui.item.value );     // add the selected item
              terms.push( "" );                // add placeholder to get the semicolon-and-space at the end
              this.value = terms.join( "; " );
              var indice = indexOfObjectsArray(people, 'value', terms[nbSearch-1]); // get the index in the array people of the searched person
              var bureau = people[indice].data.physicalDeliveryOfficeName[0];
              listeBureaux.push(bureau);        //[location office, desk number] --> example listeBureaux=["La Boursidière:O2-D-03", "La Boursidière:N3-A-10","La Boursidère: N3-B-02"]

             // -- update the array listeSplitID --
              var splitID = bureau.split(/\s+:\s+/); 
              if ((splitID[0] === undefined) || (splitID[1] === undefined)){  //check if the format of the desk is valid. If invalid, the desk number is defined as "noplace"
                listeSplitID.push("noplace");}
              else {
                listeIdentifiants.push([splitID[1],indice]);
                if (listeSplitID.indexOf(splitID[1]) === -1){
                  listeSplitID.push(splitID[1]);}} //keep only the desk number --> listeSplitID=["O2-D-03", "N3-A-10","N3-B-02"]
              console.log("SplitID[0] : " + splitID[0] + " && Split[1] : " + splitID[1]);
              console.log("Liste de splitID : " + listeSplitID);
              console.log("Nom des personnes : " + terms);
              plotNumberOfPeople(personneParPlateau, listeSplitID, terms,people,listeIdentifiants);
              console.log("Number of searched people having a location in the office : " + listeSplitID.length);
              return false;
            }
          });
       });
});

 // ----Function plotNumberOfPeople : shows on the page the number of searched people group by maps --> example personneParPlateau={n0: 0, n1: 0, n2: 0, n3: 2, n4: 0, o2: 1, o3: 0, o4: 0, externe: 0}
function plotNumberOfPeople(personneParPlateau, listeSplitID, terms,people,listeIdentifiants){
  var aaa = document.getElementById("search-button");
  var k=0; 
  var listePlateau =[];
  
       // -- event on button "search" clicked --
       aaa.onclick = function(){
                // -- update the list listePlateau with the data of each searched person -- 

                for(k=0;k<listeSplitID.length;k++){ 
                 if (terms.indexOf(terms[k]) === k){
                    listePlateau.push(listeSplitID[k].split(/-/)[0]);}
                }
                console.log("Liste Plateau : " + listePlateau);

                for(k=0;k<listePlateau.length;k++){
                  switch(listePlateau[k]){
                                case "N0": personneParPlateau.n0++;
                                    break;
                                case "N1": personneParPlateau.n1++;
                                    break;
                                case "N2": personneParPlateau.n2++;
                                    break;
                                case "N3": personneParPlateau.n3++;
                                    break;
                                case "N4": personneParPlateau.n4++;
                                    break;
                                case "O2": personneParPlateau.o2++;
                                    break;
                                case "O3": personneParPlateau.o3++;
                                    break;
                                case "O4": personneParPlateau.o4++;
                                    break;
                                case "noplace" : personneParPlateau.externe++;
                                    break;
                  }
                } 
                if (personneParPlateau.n4 > 0){
                d3.select("#N4-personnes")
                  .text("- " + personneParPlateau.n4 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.o4 > 0){
                d3.select("#O4-personnes")
                  .text("- " + personneParPlateau.o4 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.n3 > 0){
                d3.select("#N3-personnes")
                  .text("- " + personneParPlateau.n3 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.o3 > 0){
                d3.select("#O3-personnes")
                  .text("- " + personneParPlateau.o3 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.n2 > 0){
                d3.select("#N2-personnes")
                  .text("- " + personneParPlateau.n2 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.o2 > 0){
                d3.select("#O2-personnes")
                  .text("- " + personneParPlateau.o2 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.n1 > 0){
                d3.select("#N1-personnes")
                  .text("- " + personneParPlateau.n1 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.n0 > 0){
                d3.select("#N0-personnes")
                  .text("- " + personneParPlateau.n0 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.externe > 0){
                d3.select("#nbOutside")
                  .text("- " + personneParPlateau.externe + " -")
                  .style("color", "	rgb(20,200,20)");}
                console.log("plot nb personnes");

                plotResult(listeSplitID, personneParPlateau.externe,people,listeIdentifiants);
       };  
};

// ------Function to order the list listeIdentifiants -----------
// example getPersonByArea([["N4-A-03",5],["O2-B-08",64],["N4-D-6",255]],"N4") =[["N4-A-03",5],["N4-D-6",255]]
function getPersonsByArea(listPersons,area){
  var res=[];
  for (var i=0;i<listPersons.length;i++){ 
    if (listPersons[i][0].split(/-/)[0]==area){
    res.push(listPersons[i]);
   }
 }
 return res; 
}


// ------Function plotResult : display the location of searched people on the maps -----
// TO DO : Not possible to go back to the main page of results 
function plotResult(listeSplitID,nbExterne,people,listeIdentifiants){
  var i=0;
  var cpt=0;
  var table_tot=d3.selectAll("#tables");
  var mapSearch = []; //list of office areas of searched people --> example : mapSearch=[O2,N3] 
  // fills mapSearch. No duplicate possible
  for (i=0;i<listeSplitID.length;i++){
    if (listeSplitID[i] === "noplace" ){ 
      console.log("Externe : " + listeSplitID[i]);
      if (mapSearch.indexOf(listeSplitID[i]) ===(-1)){
                   mapSearch.push(listeSplitID[i]);}
    }
    else{ 
      console.log("Personne : " + listeSplitID[i]);
      if (mapSearch.indexOf((listeSplitID[i]).split(/-/)[0]) ===(-1)){
                   mapSearch.push(listeSplitID[i].split(/-/)[0]);
        var position = listeSplitID[i]; 
        var table=table_tot.select("#" + position);   //example :<g  id="N2-A-01"><rect fill="#f7f73b" fill-opacity="0.66" width="25.52841" height="12.577848" x="27.785971" y="249.75424" /></g>
        table.append("image")
            .attr("xlink:href", "./img/pin_final.png")
            .attr("width", "30")
            .attr("height", "50")
            .attr("x",table.select("rect").attr("x") -10)
            .attr("y",table.select("rect").attr("y") -40);
      }
    }
  }
  console.log(mapSearch);
       //call result : display a map (user must have clicked on it) with the results of the search
      $('.result').click(function(){
         var clicked_id = this.id;
         var buro = clicked_id.split(/-/);
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
                        
                        console.log("MapName loaded : " + mapControl.mapName);
                        // To load the map with all the data
                        mapControl.mapPlot(mapControl.mapName, false, function() {
                          var tooltip; 
                          var id_persons_by_area=[];
                          console.log(listeIdentifiants);
                          id_persons_by_area=getPersonsByArea(listeIdentifiants,mapControl.mapName); //ex: [["N3-A-05",65],["N3-C-04",110]]
                          console.log(id_persons_by_area);
                          var id_person=[];
                          var data_person,xPosition,yPosition;
                          for (var k=0;k<id_persons_by_area.length;k++){
                            id_person=id_persons_by_area[k];
                            console.log(id_person);
                            data_person=people[id_person[1]].data;
                            console.log("Personne de la MAP cliquée : " + id_person[0]);
                            table = d3.select("#tables")
                                          .select("#" + id_person[0]);
                            var xPosition = table.select("rect").attr("x")-10;
											      var yPosition = table.select("rect").attr("y")-40;

                            //to load pin on people position
                            table.append("image")
                                      .attr("xlink:href", "./img/pin_final.png")
                                      .attr("width", "30")
                                      .attr("height", "50")
                                      .attr("x", xPosition)
                                      .attr("y", yPosition);
                            yPosition += $(window).scrollTop(); // get scroll pixels to correct tooltip's yPostion
                                //console.log(xPosition,yPosition);
                            //To load tooltip with data on persons
                            tooltip = d3.select(".tooltip");
										        tooltip.html(data_person.cn[0] + "<br/>"+ data_person.mail[0] + "<br/>" + data_person.physicalDeliveryOfficeName[0])
											                  .style("left", (xPosition) + "px")
											                  .style("top", (yPosition) + "px")
										        	          .style("height", "50px");
										        tooltip.transition()
											                  .duration(200)
											                  .style("opacity", .9)
											                  .style("z-index", 20);
										        event.stopPropagation();
                                /*$("#search-back").click(function () {
										              tooltip.transition()
											                                .duration(500)
											                               .style("opacity", 0)
											                               .style("z-index", -1);})   */  
                              }
                              //to load result on extern people
                              d3.select("#extern-result")
                                  .text(nbExterne + " Personne(s) externe(s)");
                          });
                          mapControl.existMap = true;
  
                       // call search-back : display the next map with results ("suivant" button)
                          $('#search-back').click(function(){

                              j= ( (j+1) % (mapSearch.length) );
                              console.log("j = " + j);
                              console.log("MapSearch[j] : " + mapSearch[j]);
                              //console.log("listeSplitID : " + listeSplitID[i]);                                    
                              if(mapSearch[j] !== "noplace"){
                                d3.select(".map").select("svg").remove();
                                mapControl.existMap = false;
                                mapControl.mapName = mapSearch[j] ;
                                // To show the title stair - example : "Etage N4"
                                d3.select("#etage").data(["Etage "+mapControl.mapName]).text(function(d) { return d; });

                                mapControl.mapPlot(mapSearch[j], false, function() {
                                  var id_persons_by_area=[];
                                  id_persons_by_area=getPersonsByArea(listeIdentifiants,mapSearch [j]); //ex: [["N3-A-05",65],["N3-C-04",110]]
                                  console.log(id_persons_by_area);
                                  var id_person=[];
                                  var data_person,xPosition,yPosition;
                                  for (var k=0;k<id_persons_by_area.length;k++){ //all the searched people located in this area (mapSearch[j])
                                    id_person=id_persons_by_area[k];
                                    console.log(id_person);
                                    data_person=people[id_person[1]].data;
                                    console.log("Map suivante : " + mapSearch[j] + " || Personne de la map : " + data_person.cn[0]);
                                    table = d3.select("#tables")
                                                      .select("#" + id_person[0]);
                                    var xPosition = table.select("rect").attr("x")-10;
											              var yPosition = table.select("rect").attr("y")-40;
                                    table.append("image")
                                                .attr("xlink:href", "./img/pin_final.png")
                                                .attr("width", "30")
                                                .attr("height", "50")
                                                .attr("x", xPosition)
                                                .attr("y", yPosition);

                                    d3.select("#extern-result")
                                                .text(nbExterne + " Personne(s) externe(s)");

										                yPosition += $(window).scrollTop(); // get scroll pixels to correct tooltip's yPostion
                                    //console.log(xPosition,yPosition);
                                    var tooltip = d3.select(".tooltip");
                                    //console.log(id_person.cn);
										                tooltip.html(data_person.cn[0] + "<br/>"+ data_person.mail[0] + "<br/>" + data_person.physicalDeliveryOfficeName[0])
											                          .style("left", (xPosition) + "px")
											                          .style("top", (yPosition) + "px")
										        	                  .style("height", "50px");
										                tooltip.transition()
											                            .duration(200)
											                            .style("opacity", .9)
											                            .style("z-index", 20);
										                event.stopPropagation();
                                    /*$("#search-back").click(function () {
										                  tooltip.transition()
											                               .duration(500)
											                               .style("opacity", 0)
											                               .style("z-index", -1);})*/

                                    mapControl.existMap = true;
                                        }
                                      });                          
                                    } 
                          });
         }
      });        
};

