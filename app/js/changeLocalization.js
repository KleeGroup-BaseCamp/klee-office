//------------ script to change his own localization --------

'use strict';
// global variables
var	server= "http://localhost:3000/";
var myData=[d3.select("#personal-firstname")[0][0].textContent, d3.select("#personal-lastname")[0][0].textContent,"",""];

for (var i =0; i < document.getElementsByClassName('desk-maj').length ; i++ ){
document.getElementsByClassName('desk-maj')[i].addEventListener("click",changeLocalization);}

//First user need to choose the site
function changeLocalization() {
    d3.select("#menu-withoutresult").style("display", "none");
    d3.select("#menu-newlocation").style("display", "");
    d3.select("#menu-withresult").style("display", "none");

    var newSite;
    d3.selectAll(".desk-maj").style("visibility","hidden");
    d3.select("#title-default").html("MODE Changement de bureau");
    d3.select("#text-default").html('<p>Veuillez choisir le site ou l\'étage dans le menu</p><br/><button id=\"cancelMove\"><a href="'+server+'">Annuler</a></button>');
    d3.selectAll(".siteLocation").on("click",function() {chooseSite()});
    d3.selectAll(".list_etage").on("click",function() {chooseDesk()});
    validateDesk();
    function chooseSite() {
        var mySite=d3.event.target.id.split(/_/)[0];
        if (mySite=="boursidiere"){
            return;
        }
        else{var sitesExterne=["Issy-les-Moulineaux","Le Mans","Lyon","Bourgoin-Jailleux","Montpellier","Sur site Client"]
            for (var i=0;i<sitesExterne.length;i++){
                if (sitesExterne[i].indexOf(mySite)!=-1){
                    newSite=sitesExterne[i];
                }
            }
            console.log(newSite);
            validateSite(newSite);
        }
    }
    function chooseDesk(){
        var etage = document.querySelector(d3.event.target.id);
		//mapControl.eraseMap();
        var myMap=d3.event.target.id.split(/_/)[0];
		// if no map, show mapN0
		if (!mapControl.existMap) {
			mapControl.mapName = myMap;
			mapControl.mapPlot(myData,mapControl.mapName,true, function() {validateDesk()});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN0
		else if (mapControl.mapName !== myMap) {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = myMap;
			mapControl.mapPlot(myData,mapControl.mapName,true, function() {validateDesk()});
		}
		//$('<h1 class="'+myMap+'">Etage '+myMap+'</h1>').prependTo($('#map-name'));
    }
}
function validateDesk(){
    //need to choose a new desk
    d3.select("#text-default").html("<br/>Veuillez cliquer sur un nouveau bureau<br/><button id=\"cancelMove\"><a href=\""+server+"\">Annuler</a></button>");
    
	var allTables = d3.select("#tables").selectAll("g")
    allTables.style("cursor", "pointer")
    allTables.on("click", function(){
			var newDesk = d3.event.target.parentNode.id;
            var newSite="La Boursidière";
            d3.json(server + "getPersonByDesk/"+newDesk, function(isDeskAvailable){
                    if (isDeskAvailable.length===0){
                        d3.select("#text-default").html("Vous avez choisi le bureau "+newDesk
                            +"<br/>Confirmez-vous ce changement ?"+
                            "<button id=\"validateMove\" >Valider</button>"+
                            "<button id=\"cancelMove\"><a href=\""+server+"\">Annuler</a></button>");
                        document.getElementById("validateMove").onclick = function() {validateMove(newSite,newDesk)};
                    }
                    else{
                         d3.select("#text-default").html("ATTENTION vous avez choisi le bureau "+newDesk
                            +" qui déjà occupé par "+isDeskAvailable[0].firstname+" "+isDeskAvailable[0].lastname
                            +"<br/>Confirmez-vous ce changement ?"+
                            "<button id=\"validateMove\" >Valider</button>"+
                            "<button id=\"cancelMove\"><a href=\""+server+"\">Annuler</a></button>");
                        document.getElementById("validateMove").onclick = function() {validateMove(newSite,newDesk)};
                    }
                });
		});
        document.getElementById("cancelMove").addEventListener("click", function() {event.stopPropagation()})
        return
}

//Then if the site is la boursidière, user must choose the desk and confirm it
//     if not, user only must confirm the site
function validateSite(newSite){ 
    d3.select("#text-default").html('Vous avez choisi le site '+newSite
                            +'<br/>Confirmez-vous ce changement ?'+
                            '<button id="validateMove" >Valider</button>'+
                            '<button id="cancelMove"><a href="'+server+'">Annuler</a></button>');
        document.getElementById("validateMove").onclick = function() {validateMove(newSite,"externe")};
}

// finally, site and desk have been choosen, database must be updated
function validateMove(newSite,newDesk){
    if (newSite=="La Boursidière"){
        d3.select("#text-default").html("Vous avez validé un nouveau bureau sur le site La Boursidière"+
            "<br/>Votre nouveau bureau est "+newDesk+"<br/><button id=\"backHome\"><a href=\""+server+"\">Rafraîchir la page</a></button>")
    }
    else{
        d3.select("#text-default").html("Vous avez validé un nouvel emplacement"+
            "<br/>Votre nouveau site est "+newSite+"<br/><button id=\"cancelMove\"><a href=\""+server+"\">Retour au menu principal</a></button>")}
    var data={"firstname":myData[0],"lastname":myData[1],"desk-name":newDesk,"site-name":newSite};
    console.log(data)
    d3.json(server +"myLocalization", function(){
            console.log("save my new desk !")})
            .header("Content-Type","application/json")
            .send("POST", JSON.stringify(data));   
}

