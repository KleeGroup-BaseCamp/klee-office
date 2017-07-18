//------------ script to change his own localization --------

'use strict';
// global variables
var	server= "http://localhost:3000/";
var myData=[d3.select("#personal-firstname")[0][0].textContent, d3.select("#personal-lastname")[0][0].textContent,"",""];


document.getElementById("button-localization").addEventListener("click",function() {changeLocalization()});
//

//First user need to choose the site
function changeLocalization() {
    var newSite;
    d3.select("#button-localization").style("visibility","hidden").style("width","0px").style("height","0px");
    d3.select("#title-default").html("MODE Changement de bureau");
    d3.select("#text-default").html('<p><label for="site">Veuillez choisir le site</label><br/>'+
        '<select name="site" id="site">'+
           '<option value="La Boursidière">La Boursidière</option>'+
           '<option value="Issy-les-Moulineaux">Issy-les-Moulineaux</option>'+
           '<option value="Le Mans">Le Mans</option>'+
           '<option value="Lyon">Lyon</option>'+
           '<option value="Bourgoin-Jailleux">Bourgoin-Jailleux</option>'+
           '<option value="Montpellier">Montpellier</option>'+
           '<option value="sur site Client">Sur site client</option>'+
        '</select></p>'+
        '<br/><button id="validateSite" >Valider</button><button id="cancelMove"><a href="'+server+'">Annuler</a></button>');
    document.getElementById("validateSite").onclick = function() {
        newSite=document.getElementById("site").options[document.getElementById("site").selectedIndex].value;
        console.log(newSite)
        validateSite(newSite);
    }
}

//Then if the site is la boursidière, user must choose the desk and confirm it
//     if not, user only must confirm the site
function validateSite(newSite){
    if (newSite=="La Boursidière"){ //need to choose a new desk
        d3.select("#text-default").html("<br/>Veuillez cliquer sur un nouveau bureau<br/><button id=\"cancelMove\"><a href=\"http://localhost:3000/\">Annuler</a></button>");
	    var allTables = d3.select("#tables")
		    .selectAll("g")
		    .style("cursor", "pointer").on("click", function(){
			var newDesk = d3.event.target.parentNode.id;
            var newSite="La Boursidière";
            d3.json(server + "getPersonByDesk/"+newDesk, function(isDeskAvailable){
                    if (isDeskAvailable.length===0){
                        d3.select("#text-default").html("Vous avez choisi le bureau "+newDesk
                            +"<br/>Confirmez-vous ce changement ?"+
                            "<button id=\"validateMove\" >Valider</button>"+
                            "<button id=\"cancelMove\"><a href=\"http://localhost:3000/\">Annuler</a></button>");
                        document.getElementById("validateMove").onclick = function() {validateMove(newSite,newDesk)};
                    }
                    else{
                         d3.select("#text-default").html("ATTENTION vous avez choisi le bureau "+newDesk
                            +" qui déjà occupé par "+isDeskAvailable[0].firstname+" "+isDeskAvailable[0].lastname
                            +"<br/>Confirmez-vous ce changement ?"+
                            "<button id=\"validateMove\" >Valider</button>"+
                            "<button id=\"cancelMove\"><a href=\"http://localhost:3000/\">Annuler</a></button>");
                        document.getElementById("validateMove").onclick = function() {validateMove(newSite,newDesk)};
                    }
                });
		});
        document.getElementById("cancelMove").addEventListener("click", function() {event.stopPropagation()})
        return
    }else{ //just need to validate
        d3.select("#text-default").html('Vous avez choisi le site '+newSite
                            +'<br/>Confirmez-vous ce changement ?'+
                            '<button id="validateMove" >Valider</button>'+
                            '<button id="cancelMove"><a href="'+server+'">Annuler</a></button>');
        document.getElementById("validateMove").onclick = function() {validateMove(newSite,"externe")};
    }
}

// finally, site and desk have been choosen, database must be updated
function validateMove(newSite,newDesk){
    if (newSite=="La Boursidière"){
        d3.select("#text-default").html("Vous avez validé un nouveau bureau sur le site La Boursidière"+
            "<br/>Votre nouveau bureau est "+newDesk)
    }
    else{
        d3.select("#text-default").html("Vous avez validé un nouvel emplacement"+
            "<br/>Votre nouveau site est "+newSite)}
    var data={"firstname":myData[0],"lastname":myData[1],"desk-name":newDesk,"site-name":newSite};
    console.log(data)
    d3.json(server +"myLocalization", function(){
            console.log("save my new desk !")})
            .header("Content-Type","application/json")
            .send("POST", JSON.stringify(data));   
}

