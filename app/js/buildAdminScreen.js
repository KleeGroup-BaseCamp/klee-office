
/**
 * Created by msalvi on 08/09/2016.
 */
(function(window) {

    //control access to the page - limited for administrators only
    console.log("admin-screen");
    var server="http://localhost:3000/";
    var myData=[d3.select("#personal-firstname")[0][0].textContent, d3.select("#personal-lastname")[0][0].textContent,"",""];

    d3.json(server + "getAdministrator/"+myData[0]+"/"+myData[1], function(res){
        if (res[0].isAdministrator){
            d3.select("#error-admin").style("display","none");
            d3.select(".list-validators").style("display","");
        }
        else{
            d3.select(".list-validators").style("display","none");
            d3.select("#error-admin").style("display","").html(" Vous n'avez les droits d'accès à cette page <br/><a href=\""+server+"\"><button class=\"back-index\">Revenir à la page d'accueil</button></a>")
        }
    })


    window.addEventListener("load", function(){
        adminControl.plotValidatorsList();
    });

}(window));