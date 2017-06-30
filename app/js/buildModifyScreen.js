
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
    }
    window.addEventListener("load", function(){
        adminControl.plotList(true);
    });

    var stepOne = document.getElementById("step-one");
    stepOne.addEventListener("click", function(){
        // title colors
        d3.select("#step-one").style("color", "#246b8f");
        d3.select("#step-two").style("color", "#6d6e71");
        // erase lists
        adminControl.eraseAll();
        preparePlot();
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


    // prepare json object to send data in ajax request
    $("#save-movings").click(function(event){
        console.log("button save movings");
        var movings = [];
        var peopleList = d3.selectAll(".people-rect");
        var href = window.location.href;
        var peopleIds = [];
        peopleList[0].forEach(function(elem){
            peopleIds.push(elem.id.split("rect-")[1]);
        });
        peopleIds.forEach(function(el){
            var movContent;
            if(!d3.select("#mov-"+el).empty()) {
                movContent = d3.select("#mov-" + el).text().split(" -> ");
                movings.push({
                    perId: el,
                    former: movContent[0],
                    new: movContent[1],
                    conId: href.split("modify")[1]
                });
            }
        });
        var success = function(){
            window.location.href = "http://localhost:3000/configurations";
            //window.location.href = "http://local-map/configurations";
        };
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'http://localhost:3000/saveMovings',
            //url: 'http://local-map/saveMovings',
            contentType: "application/json",
            data: JSON.stringify(movings),
            success: success
        });

    });
    $("#cancel-movings").click(function(event){
         window.location.href = "http://localhost:3000/configurations";
        //window.location.href = "http://local-map/configurations";
    });

}(window));