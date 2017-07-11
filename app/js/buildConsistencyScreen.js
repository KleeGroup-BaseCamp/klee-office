/**
 *
 */
(function(window) {

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