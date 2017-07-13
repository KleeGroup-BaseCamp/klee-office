//------------ script to change his own localization --------

'use strict';
// global variables
var	server= "http://localhost:3000/";
var list_area=["N0","N1","N2","N3","N4","O1","O2","O3","O4","externe"];
var myData=["Alain GOURLAY","N4-C-01"];

document.getElementById("button-localization").addEventListener("click",function() {changeLocalization()});
//

//document.getElementById("validateMove").onclick = function() {validateMove()};
function changeLocalization() {
    d3.select("#button-localization").style("visibility","hidden").style("width","0px").style("height","0px");
    d3.select("#title-default").html("MODE Changement de bureau");
    d3.select("#text-default").html("<br/>Veuillez cliquer sur un nouveau bureau<br/><button id=\"cancelMove\"><a href=\"http://localhost:3000/\">Annuler</a></button>");
	var allTables = d3.select("#tables")
		.selectAll("g")
		.style("cursor", "pointer").on("click", function(){
			var newDesk = d3.event.target.parentNode.id;
            d3.json(server + "getPersonByDesk/"+newDesk, function(isDeskAvailable){
                    if (isDeskAvailable.length===0){
                        d3.select("#text-default").html("Vous avez choisi le bureau "+newDesk
                            +"<br/>Confirmez-vous ce changement ?"+
                            "<button id=\"validateMove\" >Valider</button>"+
                            "<button id=\"cancelMove\"><a href=\"http://localhost:3000/\">Annuler</a></button>");
                        document.getElementById("validateMove").onclick = function() {validateMove(newDesk)};
                    }
                    else{
                         d3.select("#text-default").html("ATTENTION vous avez choisi le bureau "+newDesk
                            +" qui déjà occupé par "+isDeskAvailable[0].firstname+" "+isDeskAvailable[0].lastname
                            +"<br/>Confirmez-vous ce changement ?"+
                            "<button id=\"validateMove\" >Valider</button>"+
                            "<button id=\"cancelMove\"><a href=\"http://localhost:3000/\">Annuler</a></button>");
                        document.getElementById("validateMove").onclick = function() {validateMove(newDesk)};
                    }
                });
		});
        document.getElementById("cancelMove").addEventListener("click", function() {event.stopPropagation()})
        return
}


function validateMove(newDesk){
    d3.select("#text-default").html("Vous avez validé un nouveau bureau "+
            "<br/>Votre nouveau bureau est "+newDesk)
    var data={"desk-name":newDesk,"firstname":myData[0],"lastname":myData[1]};
    d3.json(server +"myLocalization", function(){
            console.log("save my new desk !")})
        .header("Content-Type","application/json")
        .send("POST", JSON.stringify(data));
}

