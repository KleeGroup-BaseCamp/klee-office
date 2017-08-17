
/**
 * Created by msalvi on 08/09/2016.
 */
(function(window) {

    //control access to the page - limited for administrators only
    console.log("admin-screen");
    var server="http://localhost:3000/";
    //var	server = "http://local-map/";
    var myData=[d3.select("#personal-firstname")[0][0].textContent, d3.select("#personal-lastname")[0][0].textContent,"",""];

    d3.json(server + "getAdministrator/"+myData[0]+"/"+myData[1], function(res){
        if (res[0].isAdministrator){
            preparePlot()
        }
        else{
            d3.select("#div-to-hide").style("display","none");
            d3.select("#error-admin").style("display","").html("<p> Vous n'avez les droits d'accès à cette page </p><a href=\""+server+"\"  class=\"back-index mybutton\">Revenir à la page d'accueil</a>")
        }
    })

    function preparePlot(){
        d3.select("#error-admin").style("display","none")
        d3.select("#div-to-hide").style("display","");

        adminControl.plotValidatorsList();
        adminControl.plotAdminList();
        d3.selectAll("#admin-buttons button").style('background-color','black').style('color','white')
        d3.select("#plot-valid").style('background-color','white').style('color','black')
        d3.select("#plans-block").style("display","none");
        d3.select(".list-admin").style("display","none");
        d3.select(".list-validators").style("display","");
    };

    $("#plot-valid").click(function () {
        d3.selectAll("#admin-buttons button").style('background-color','black').style('color','white')
        d3.select("#plot-valid").style('background-color','white').style('color','black')

        d3.select("#plans-block").style("display","none");
        d3.select(".list-validators") .style("display","");
        d3.select(".list-admin").style('display','none');
    });

    $("#plot-plans").click(function () {
        d3.selectAll("#admin-buttons button").style('background-color','black').style('color','white')
        d3.select("#plot-plans").style('background-color','white').style('color','black')
        d3.select("#plans-block").style("display","");
        d3.select(".list-validators") .style("display","none");
        d3.select(".list-admin").style('display','none');
        d3.select("#whole-map").select("svg").selectAll("g").select("#pin_home").remove();
    });

    $('#plot-admin').click(function () {
        d3.selectAll("#admin-buttons button").style('background-color','black').style('color','white')
        d3.select("#plot-admin").style('background-color','white').style('color','black')
        d3.select("#plans-block").style("display","none");
        d3.select(".list-validators") .style("display","none");
        d3.select(".list-admin").style('display','');
    });


}(window));