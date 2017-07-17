/**
 *  Function to build configurations screen
 */

(function(window) {

    //control access to the page
    console.log("configurations-screen");
    var server="http://localhost:3000/";

    var myData=["Alain","GOURLAY","N4-C-01"];
    var level="none";
    var dep=""

    d3.json(server + "getLevelValidator/"+myData[0]+"/"+myData[1], function(isValidator){
        console.log(isValidator);
        //give access to members of his business unit
        if (isValidator[0].isValidatorLvlOne==true && isValidator[0].isValidatorLvlTwo ==false){
            level="1";
            dep=isValidator[0].businessUnit_id;
            d3.select("#error-conf").style("display","none");
            console.log(dep);
        }
        //give access to memebers of his company 
        if (isValidator[0].isValidatorLvlTwo==true){
            level="2"; 
            d3.select("#error-conf").style("display","none");
            dep="all";
        }
        else{
            d3.select(".two-columns").style("visibility","hidden");
            d3.select("#error-conf").style("height","auto").style("width","auto").html(" Vous n'avez les droits d'accès à cette page <br/><a href=\""+server+"\"><button class=\"back-index\">Revenir à la page d'accueil</button></a>");
        }
        configurationsControl.plotConfList(level,dep);
    });
    // print popin to add a new configuration
    $("#add-title").click(function (event) {
        if(configurationsControl.isPopin !== true){
            $('<div id="popin-add">'+
                '<h3>Cr&eacuteer une nouvelle configuration</h3>'+
                '<img src="img/crossDelete.png" id="conf-cancel" width="25px">'+
                '<br><br><br>'+
                '<form action="/addNewConfiguration" method="post">'+
                '<div class="inline left-labels">'+
                '<label for="name">Nom (*) : </label><br /><br />'+
                '<label for="creator">Auteur : </label><br /><br />'+
                '<label for="dateCreation">Date : </label><br /><br />'+
                '</div>'+ 
                '<div class="inline">'+
                '<input class="field" type="text" id="name" name="name" required/><br />'+
                '<input class="disabled-field" type="text" id="creator" name="creator"  value="" readonly /><br />'+
                '<input class="disabled-field" type="text" id="dateCreation" name="dateCreation" value="" readonly /><br />'+
                '</div>'+
                '<input class="submit" id="add-conf" type="submit" value="Valider"/>'+
                '<input class="submit" id="conf-cancel" type="reset" value="Annuler"/>'+
                '</form>'+

                '</div>').insertAfter($('.two-columns'));
        }
        configurationsControl.isPopin = true;
        var today = new Date().toLocaleDateString();
        d3.select("#dateCreation").attr("value", today);
        d3.select("#creator").attr("value",myData[0]+" "+myData[1]);

        // remove popin
        // click somewhere else will make popin disappear
        $("#popin-add").click(function (event) {
            event.stopPropagation();
        });   
        jQuery('html,body').animate({scrollTop:0},0);
        event.stopPropagation();
    });
    $("#add-conf").click(function () {
        console.log("j'ai clické");
        if(configurationsControl.isPopin === true){
            $('#popin-add').remove();
            configurationsControl.isPopin = false;
        }
        
    });    

    $("html").click(function () {
        if(configurationsControl.isPopin === true){
            $('#popin-add').remove();
            configurationsControl.isPopin = false;
        }
    });

    $("#conf-cancel").click(function () {
        if(configurationsControl.isPopin === true){
            $('#popin-add').remove();
            configurationsControl.isPopin = false;
        }
    }); 

    $("#plot-noplace").click(function () {
         d3.json(server + "getProfilByPerson/"+myData[0]+"/"+myData[1], function(profil){
            if((profil[0].lvlone === true) && (profil[0].lvltwo === false)){
                d3.json(server + "getBusUnitCompanyByPerson/"+myData[0]+"/"+myData[1], function(info){
                    d3.json(server + "getNoPlacePersonByBusUnit/"+info[0].busid+"/"+info[0].comid, function(bus){
                        var i=0;
                        var mytext='';
                        for (i=0;i<bus.length;i++){
                            mytext += bus[i].firstname + " " + bus[i].lastname + '<br/>';} 
                        d3.select("#list-noplace") 
                        .html(mytext);
                    });
                });
            }
            else if(profil[0].lvltwo === true){
                d3.json(server + "getBusUnitCompanyByPerson/"+myData[0]+"/"+myData[1], function(info){
                    console.log(info[0].comid);
                    d3.json(server + "getNoPlacePersonByCompany/2"/*+info[0].comid*/, function(company){
                        var i=0;
                        var mytext='';
                        for (i=0;i<company.length;i++){
                            mytext += company[i].firstname + " " + company[i].lastname + '<br/>';}       
                        d3.select("#conf-list")
                            .style("visibility", "hidden");
                        d3.select("#list-noplace") 
                         .style("visibility", "visible")
                        .html(mytext);
                    });
                });
            }
        });
    });

    $("#plot-config").click(function () {
        d3.select("#conf-list")
            .style("visibility", "visible");
        d3.select("#list-noplace")
            .style("visibility", "hidden");
    });
    
}(window));