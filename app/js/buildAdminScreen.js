
/**
 * Created by msalvi on 08/09/2016.
 */
(function(window) {

    //control access to the page - limited for administrators only
    console.log("admin-screen");
    var server="http://localhost:3000/";
    var myData=["Alain", "GOURLAY", "",""];

    d3.json(server + "getAdministrator/"+myData[0]+"/"+myData[1], function(res){
        if (res[0].isAdministrator){
            d3.select("#error-admin").style("visibility","hidden").style("height","0px").style("width","0px");
            d3.select(".list-validators").style("visibility","visible").style("height","auto").style("width","auto");
        }
        else{
            d3.select(".list-validators").style("visibility","hidden");
            d3.select("#error-admin").style("height","auto").style("width","auto").html(" Vous n'avez les droits d'accès à cette page <br/><a href=\""+server+"\"><button class=\"back-index\">Revenir à la page d'accueil</button></a>")
        }
    })


    window.addEventListener("load", function(){
        adminControl.plotValidatorsList();
    });

}(window));