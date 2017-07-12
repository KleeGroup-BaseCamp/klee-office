/**
 *  Function to build configurations screen
 */

(function(window) {

    //control access to the page
    console.log("configurations-screen");
    var server="http://localhost:3000/";
    var myData=["Alain GOURLAY","N4-C-01"];
    var level="none";

    d3.json(server + "getLevelValidator/"+myData[0].split(/ /)[0]+"/"+myData[0].split(/ /)[1], function(isValidator){
        //give access to members of his business unit
        if (isValidator[0].isValidatorLvlOne){
            level="1";
            d3.select("#error-conf").style("display","none");
        }
        //give access to memebers of his company 
        else if (isValidator[0].isValidatorLvlTwo){
            level="2"; 
            d3.select("#error-conf").style("display","none");
        }
        else{
            d3.select(".two-columns").style("visibility","hidden");
            d3.select("#error-conf").style("height","auto").style("width","auto").html(" Vous n'avez les droits d'accès à cette page <br/><a href=\""+server+"\"><button class=\"back-index\">Revenir à la page d'accueil</button></a>");
        }
    })

    window.addEventListener("load", function(){
        configurationsControl.plotConfList(level);
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
                    '<!-- here a name is already set to be able to test the service but it has to be replaced with the name a the connected person -->' +
                '<input class="disabled-field" type="text" id="creator" name="creator"  value="" readonly /><br />'+
                '<input class="disabled-field" type="text" id="dateCreation" name="dateCreation" value="" readonly /><br />'+
                '</div>'+
                '<input class="submit" id="add-conf" type="submit" value="Valider"/>'+
                '</form>'+

                '</div>').insertAfter($('.two-columns'));
        }
        configurationsControl.isPopin = true;
        var today = new Date().toLocaleDateString();
        d3.select("#dateCreation").attr("value", today);
        d3.select("#creator").attr("value",myData[0]);

        // remove popin
        // click somewhere else will make popin disappear
        $("#popin-add").click(function (event) {
            event.stopPropagation();
        });   
        jQuery('html,body').animate({scrollTop:0},0);
        event.stopPropagation();
    });
    $("#add-conf").click(function () {
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
}(window));