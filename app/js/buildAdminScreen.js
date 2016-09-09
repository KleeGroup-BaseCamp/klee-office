
/**
 * Created by msalvi on 08/09/2016.
 */
(function(window) {

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
    }
    window.addEventListener("load", function(){
        preparePlot()
        // level
        d3.select("#level")
            .attr("value", "Niveau 1");
        adminControl.plotList(true);
    });
    var stepOne = document.getElementById("step-one");
    stepOne.addEventListener("click", function(){
        // title colors
        d3.select("#step-one").style("color", "#246b8f");
        d3.select("#step-two").style("color", "#6d6e71");
        // erase lists
        adminControl.eraseAll();
        preparePlot()
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
    });
}(window));