// -------- edit by almorin -------


//------------ script permettant de gérer la recherche de plusieurs personnes --------

'use strict';

$(function(){
    var people = [];
    var listePlateau =[];
    var listeBureaux = [];
    var listeSplitID = [];
    var personneParPlateau = {
      n0: 0, n1: 0, n2: 0, n3: 0, n4: 0, o2: 0, o3: 0, o4: 0, externe: 0
    }

    //console.log("Coucou searchMany!");
    
    function getName(element, index, array){
        people.push({value: element[1].cn[0], data: element[1]});
    }

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

       $('#search-terms')
       // don't navigate away from the field on tab when selecting an item
           .on( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB && $( this ).autocomplete( "instance" ).menu.active ) {
              event.preventDefault();
            }
          })
          .autocomplete({
            minLength: 0,
            source: function( request, response ) {
                // delegate back to autocomplete, but extract the last term
              response( $.ui.autocomplete.filter(
                people, extractLast( request.term ) ) );
                //console.log("jsuis dans source");
            },
            focus: function() {
                // prevent value inserted on focus
              return false;
            },
            select: function( event, ui ) {

              var terms = split( this.value );
              var nbSearch = terms.length;
              
              // remove the current input
              terms.pop();
              // add the selected item
              terms.push( ui.item.value );
              // add placeholder to get the semicolon-and-space at the end
              terms.push( "" );
              this.value = terms.join( "; " );
              
              //récupère l'indice de l'objet dans people de la personne recherchée
              var indice = indexOfObjectsArray(people, 'value', terms[nbSearch-1]);
              
              var bureau = people[indice].data.physicalDeliveryOfficeName[0];
              listeBureaux.push(bureau);
             
              var splitID = bureau.split(/\s+:\s+/);
              if ((splitID[0] === undefined) || (splitID[1] === undefined)){  
                listeSplitID.push("noplace");}
              else {
                listeSplitID.push(splitID[1]);} 
              console.log("SplitID[0] : " + splitID[0] + " && Split[1] : " + splitID[1]);
              console.log("Liste de splitID : " + listeSplitID);
              //remplit le tableau listePlateau par les plateau occupé par chaque personnes recherchées
              if(splitID[1]){
                listePlateau.push(splitID[1].split(/-/)[0]);
                switch(listePlateau[nbSearch-1]){
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
                }
              }else{
                listePlateau.push("noplace");
                personneParPlateau.externe++
              }
              
              plotNumberOfPeople(personneParPlateau, listeSplitID);
             
              console.log("Longueur listeSplitID : " + listeSplitID.length);
              
              return false;
            }
          });
          
       });
       
  
});

 // ------------  Fonction qui affiche à l'écran le nb de personne recherchées par map ----------- 

function plotNumberOfPeople(personneParPlateau, listeSplitID){
  var aaa = document.getElementById("search-button");
       
       aaa.onclick = function(){
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
                plotResult(listeSplitID);
       };  
};

// ----------------- Fonction qui affiche les localisations de personnes recherchées sur les map cliqués ------------------
   // on ne peut pas revenir à l'écran de résultats des recherches ------------- 

function plotResult(listeSplitID){
  var i=0;
  var cpt=0;
  var table;
  var mapSearch = [];

  //remplit le tableau mapSearch contenant les maps concernés par la recherche
  for (i=0;i<listeSplitID.length;i++){
    if (listeSplitID[i] === "noplace" ){ 
      console.log("Externe : " + listeSplitID[i]);
      if (mapSearch.indexOf(listeSplitID[i]) ===(-1)){
                   mapSearch.push(listeSplitID[i]);}
    }
    else{ 
      console.log("Personne : " + listeSplitID[i]);
      if (mapSearch.indexOf((listeSplitID[i]).split(/-/)[0]) ===(-1)){
                   mapSearch.push(listeSplitID[i].split(/-/)[0]);}
    }
  }
  console.log(mapSearch);
       
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
                          
                          mapControl.mapName = buro[0];
                          console.log("MapName ! : " + mapControl.mapName);
                          
                          
                          
                          mapControl.mapPlot(buro[0], false, function() {
                              for (i=0;i<listeSplitID.length;i++){ 
                               if (listeSplitID[i] !== "noplace"){ 
                                if (listeSplitID[i].split(/-/)[0] === buro[0]){
                                    console.log("Personne de la MAP cliquée : " + listeSplitID[i]);
                                  table = d3.select("#tables")
                                              .select("#" + listeSplitID[i]);
                                  table.append("image")
                                      .attr("xlink:href", "./img/pin_final.png")
                                      .attr("width", "30")
                                      .attr("height", "50")
                                      .attr("x", table.select("rect").attr("x") - 10)
                                      .attr("y", table.select("rect").attr("y") - 40);
                                }
                               }
                               else{
                                  
                                 cpt++;
                                 d3.select("#extern-result")
                                 .text(cpt + " Personne(s) externe(s)");}
                              
                              }
                          });
                          mapControl.existMap = true;
                          
                       // action du bouton suivant pour afficher les autres résultats
                          
                          $('#search-back').click(function(){


                              j= ( (j+1) % (mapSearch.length) );
                                      console.log("j = " + j);

                              console.log("MapSearch[j] : " + mapSearch[j]);
                              //console.log("listeSplitID : " + listeSplitID[i]);
                                    
                                    if(mapSearch[j] !== "noplace"){
                                      d3.select(".map").select("svg").remove();
                                      mapControl.existMap = false;
                                      mapControl.mapName = mapSearch[j] ;
                                      mapControl.mapPlot(mapSearch[j], false, function() {
                                        for (i=0;i<listeSplitID.length;i++){ 
                                          if(listeSplitID[i] !== "noplace"){
                                          if (listeSplitID[i].split(/-/)[0] === mapSearch[j]){
                                            console.log("Map suivante : " + mapSearch[j] + " || Personne de la map : " + listeSplitID[i]);
                                          table = d3.select("#tables")
                                                      .select("#" + listeSplitID[i]);
                                          table.append("image")
                                              .attr("xlink:href", "./img/pin_final.png")
                                              .attr("width", "30")
                                              .attr("height", "50")
                                              .attr("x", table.select("rect").attr("x") - 10)
                                              .attr("y", table.select("rect").attr("y") - 40);
                                          d3.select("#extern-result")
                                              .text(cpt + " Personne(s) externe(s)");}
                                            }
                                              
                                          }
                                      });
                                      mapControl.existMap = true;
                                    }                         
                          });                          
                     } 
         });        
};

