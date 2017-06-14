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
              console.log("Terms : " + terms);
              var nbSearch = terms.length;
              var afficheMap=0;
              //var numOffice = terms[nbSearch-1];
             // bureau.push()
            //console.log(this.data);
              // remove the current input
              terms.pop();
              // add the selected item
              terms.push( ui.item.value );
              // add placeholder to get the semicolon-and-space at the end
              terms.push( "" );
              this.value = terms.join( "; " );
              //console.log("Recherche de : " + terms);
              console.log("Nb de recherches : " + nbSearch);
              console.log("Personne ajoutée : " + terms[nbSearch-1]);
              //récupère l'indice de l'objet dans people de la personne recherchée
              var indice = indexOfObjectsArray(people, 'value', terms[nbSearch-1]);
              console.log("Indice : " + indice);
              var bureau = people[indice].data.physicalDeliveryOfficeName[0];
              listeBureaux.push(bureau);
              console.log("Bureau : " + bureau);
              console.log("Liste des bureaux : " + listeBureaux);
              var splitID = bureau.split(/\s+:\s+/);
              listeSplitID.push(splitID[1]);
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
              console.log("Plateaux : " + listePlateau);
              console.log("Personnes par plateau : " + personneParPlateau.n0 + " ; " + personneParPlateau.n1 + " ; " + personneParPlateau.n2 + " ; " + personneParPlateau.n3 + " ; " + personneParPlateau.n4 + " ; " + personneParPlateau.o2 + " ; " + personneParPlateau.o3 + " ; " + personneParPlateau.o4);
              
              afficheMap = plotNumberOfPeople(personneParPlateau);
              console.log("AfficheMap : " + afficheMap);
              if(afficheMap === 1){
                console.log("Longueur listeSplitID : " + listeSplitID.length);
                //var i=0;
               // var carte = document.getElementById("svg-" + listeSplitID[nbSearch-1].split(/-/)[0]);
               console.log("svg - " + listeSplitID[nbSearch-1].split(/-/)[0]);
               /* carte.onclick = */plotResult(listeSplitID, (nbSearch-1), listePlateau);
              }
              
              return false;
            }
          });
          
       });
       
  
});

 // ------------  Fonction qui affiche à l'écran le nb de personne recherchées par map ----------- 

function plotNumberOfPeople(personneParPlateau){
  var aaa = document.getElementById("search-button");
        console.log("fonction bouton!!")
       aaa.onclick = function(){
                if (personneParPlateau.n4 > 0){
                d3.select("#nbPn4")
                  .text("- " + personneParPlateau.n4 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.o4 > 0){
                d3.select("#nbPo4")
                  .text("- " + personneParPlateau.o4 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.n3 > 0){
                d3.select("#nbPn3")
                  .text("- " + personneParPlateau.n3 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.o3 > 0){
                d3.select("#nbPo3")
                  .text("- " + personneParPlateau.o3 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.n2 > 0){
                d3.select("#nbPn2")
                  .text("- " + personneParPlateau.n2 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.o2 > 0){
                d3.select("#nbPo2")
                  .text("- " + personneParPlateau.o2 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.n1 > 0){
                d3.select("#nbPn1")
                  .text("- " + personneParPlateau.n1 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.n0 > 0){
                d3.select("#nbPn0")
                  .text("- " + personneParPlateau.n0 + " -")
                  .style("color", "	rgb(20,200,20)");}
                if (personneParPlateau.externe > 0){
                d3.select("#nbOutside")
                  .text("- " + personneParPlateau.externe + " -")
                  .style("color", "	rgb(20,200,20)");}
       };
       return 1;
};

// ----------------- Fonction qui affiche les localisations de personnes recherchées sur les map cliqués ------------------
   // pour l'instant, n'affiche que la localisation  de la dernière personne recherchée et superpose toutes les maps concernés par les personnes recherchées ------------- 

function plotResult(listeSplitID, cpt, listePlateau){
  var i=0;
  
  var carte = document.getElementById("svg-" + listeSplitID[cpt].split(/-/)[0]);
  var table;
       
       console.log("ExisteMap 2 ! : " + mapControl.existMap + " !! listeSplitID = " + listeSplitID[cpt]);
       carte.onclick = function(){
         if(mapControl.existMap) {
                        // erase all maps' overview
                        //mapControl.eraseMap();
                        
                        //if (listePlateau[i] !== "noplace"){
                          console.log("ExisteMap 2.1 ! : " + mapControl.existMap  + " !! listeSplitID = " + listeSplitID[cpt]);
                          d3.select("#map-show")
                          .style("visibility", "visible")
                          .style("width", "100%")
                          .style("height", "100%");
                          
                          mapControl.mapName = listeSplitID[cpt].split(/-/)[0];
                          console.log("MapName ! : " + mapControl.mapName);
                          
                          mapControl.mapPlot(listeSplitID[cpt].split(/-/)[0], false, function() {
                             // for (i=0;i<listeSplitID.length;i++){
                                if (listeSplitID[cpt].split(/-/)[0] === listePlateau[cpt]){
                                    console.log("Valeur de i : " + cpt);
                                    console.log("Pb contenu listeSplitID : " + listeSplitID[cpt]);
                                  table = d3.select("#tables")
                                              .select("#" + listeSplitID[cpt]);
                                  table.append("image")
                                      .attr("xlink:href", "./img/pin_final.png")
                                      .attr("width", "30")
                                      .attr("height", "50")
                                      .attr("x", table.select("rect").attr("x") - 10)
                                      .attr("y", table.select("rect").attr("y") - 40);
                                    console.log("ExisteMap 2.5 ! : " + mapControl.existMap);
                                }
                            //  }
                          });
                          mapControl.existMap = true;
                          console.log("ExisteMap 3 ! : " + mapControl.existMap);
                     }
                    
       //  }
                    console.log("ExisteMap 4 ! : " + mapControl.existMap);
         
       };
   
};
