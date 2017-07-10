/**
 *
 */
(function(window) {
    var myData=["Alain GOURLAY","N4-C-01"];
    d3.select("#personal-name").html(myData[0]);
    d3.select("#personal-desk").html(myData[1]);
    
    window.addEventListener("load", function(){
        configurationsControl.plotConfList();
    });
    // print popin to add a new configuration
    $("#add-title").click(function (event) {
        if(configurationsControl.isPopin !== true){
            $('<div id="popin-add">'+
                '<h3>Cr&eacuteer une nouvelle configuration'+
                '</h3><br><br><br>'+
                '<form action="/addNewConfiguration" method="post">'+
                '<div class="inline left-labels">'+
                '<label for="name">Nom (*) : </label><br /><br />'+
                '<label for="creator">Auteur : </label><br /><br />'+
                '<label for="dateCreation">Date : </label><br /><br />'+
                '</div>'+ 
                '<div class="inline">'+
                '<input class="field" type="text" id="name" name="name" required/><br />'+
                    '<!-- here a name is already set to be able to test the service but it has to be replaced with the name a the connected person -->' +
                '<input class="disabled-field" type="text" id="creator" name="creator"  value="Marie-Pierre SALVI" readonly /><br />'+ //remplacer le Marie-Pierre par le nom de l'utilisateur
                '<input class="disabled-field" type="text" id="dateCreation" name="dateCreation" value="" readonly /><br />'+
                '</div>'+
                '<input class="submit" id="#add-conf" type="submit" value="Valider"/>'+
                '</form>'+
                '</div>').insertAfter($('.two-columns'));
        }
        configurationsControl.isPopin = true;
        var today = new Date().toLocaleDateString();
        d3.select("#dateCreation").attr("value", today);
        // remove popin
        // click somewhere else will make popin disappear
        $("#popin-add").click(function (event) {
            event.stopPropagation();
        });
        jQuery('html,body').animate({scrollTop:0},0);
        event.stopPropagation();
    });

    $("html").click(function () {
        if(configurationsControl.isPopin === true){
            $('#popin-add').remove();
            configurationsControl.isPopin = false;
        }
    });
}(window));