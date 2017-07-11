
/**
 * Created by msalvi on 08/09/2016.
 */
(function(window) {

    //control access to the page - limited for administrators only
    console.log("admin-screen");
    var server="http://localhost:3000/";
    var myData=["Alain GOURLAY","N4-C-01"];
    d3.json(server + "getAdministrator/"+myData[0].split(/ /)[0]+"/"+myData[0].split(/ /)[1], function(res){
        console.log(res[0].isAdministrator);
        if (res[0].isAdministrator){
            d3.select("#error-admin").style("visibility","hidden").style("height","0px").style("width","0px");
            d3.select(".list-validators").style("visibility","visible").style("height","auto").style("width","auto");
        }
        else{
            d3.select(".list-validators").style("visibility","hidden");
            d3.select("#error-admin").style("height","auto").style("width","auto").html(" Vous n'avez les droits d'accès à cette page <br/><a href=\""+server+"\"><button class=\"back-index\">Revenir à la page d'accueil</button></a>")
        }
    })


/*
    function preparePlot() {
        // remove info msg
        d3.select("#info-pole").remove();
        d3.select(".left-side")
            .style("height", "900px");
        d3.select(".right-side")
            .style("height", "900px");
        // hide form
        d3.select("#val-form")
            .style("visibility", "hidden");
        // clean form data
        d3.selectAll('.disabled-field')
            .attr("value", "");
        // clean autocomplete field
        d3.select('#validator-search')
            .attr("value, ");
    }*/
    window.addEventListener("load", function(){
        adminControl.plotValidatorsList();
    });

    /*var stepOne = document.getElementById("step-one");
    stepOne.addEventListener("click", function(){
        // title colors
        d3.select("#step-one").style("color", "#246b8f");
        d3.select("#step-two").style("color", "#6d6e71");
        // erase lists
        adminControl.eraseAll();
        preparePlot()buildAdminScreen.js
        // level
        d3.select("#level")
            .attr("value", "Niveau 1");
        adminControl.plotList(true);
    });
    var stepTwo = document.getElementById("step-two");
    stepTwo.addEventListener("click", function(){
        // title colors
        d3.select("#step-two").style("color", "#246b8f");
        d3.select("#step-one").style("color", "#6d6e71");
        // erase lists
        adminControl.eraseAll();
        preparePlot();
        // level
        d3.select("#level")
            .attr("value", "Niveau 2");
        adminControl.plotList(false);
    });*/
}(window));