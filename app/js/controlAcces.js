/**
 * control the acces to configuration and administrators pages
 */

var myData=["Alain GOURLAY","N4-C-01"];
d3.select("#personal-name").html(myData[0]);
d3.select("#personal-desk").html(myData[1]);

d3.json(server + "getLevelValidator/"+myData[0].split(/ /)[0]+"/"+myData[0].split(/ /)[1], function(isValidator){
    if (isValidator.isValidatorLvlOne ||isValidator.isValidatorLvlTwo){
        
    }
    else{

    }
})