/**
 *
 */
(function(window) {
    var myData=["Alain GOURLAY","N4-C-01"];
    d3.select("#personal-name").html(myData[0]);
    d3.select("#personal-desk").html(myData[1]);
    var href = window.location.href;
    var conId;
    if (href.split("consistency").length >= 1){
        conId = href.split("consistency")[1];
    } else {
        console.err("Configuration ID is undefined.")
    }
    window.addEventListener("load", function(){
        consistencyControl.plotconsistency(conId);
    });

}(window));