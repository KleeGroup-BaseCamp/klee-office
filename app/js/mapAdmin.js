//<![CDATA[

var selectedElement = 0;
var currentX = 0;
var currentY = 0;
var currentMatrix = 0;

function selectElement(evt) {
    console.log("selectElementEvt");
    selectedElement = evt.target;
    currentX = evt.clientX;
    currentY = evt.clientY;
    console.log("currentX = "+currentX+" || currentY = "+currentY);
    console.log(selectedElement.getAttributeNS(null, "transform"));
    currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7,-1).split(' ');

    for(var i=0; i<currentMatrix.length; i++) {
        currentMatrix[i] = parseFloat(currentMatrix[i]);
     } 
    selectedElement.setAttributeNS(null, "onmousemove", "moveElement(evt)"); 
    selectedElement.setAttributeNS(null, "onmouseout", "deselectElement(evt)");
    selectedElement.setAttributeNS(null, "onmouseup", "deselectElement(evt)");
}

function moveElement(evt){
  console.log("moveElement");
  dx = evt.clientX - currentX;
  dy = evt.clientY - currentY;
  currentMatrix[4] += dx;
  currentMatrix[5] += dy;
  newMatrix = "matrix(" + currentMatrix.join(' ') + ")";
            
  selectedElement.setAttributeNS(null, "transform", newMatrix);
  currentX = evt.clientX;
  currentY = evt.clientY;
}

function deselectElement(evt){
    console.log("deselectElement");
    console.log("x = " + selectedElement.getAttribute("x"));
    console.log("y = " + selectedElement.getAttribute("y"));
    console.log("matrix = " + selectedElement.getAttribute("transform").split(/\(/)[1].split(/\s/));
  if(selectedElement != 0){
    selectedElement.removeAttributeNS(null, "onmousemove");
    selectedElement.removeAttributeNS(null, "onmouseout");
    selectedElement.removeAttributeNS(null, "onmouseup");
    selectedElement = 0;
  }
}

$("#mode-admin").click(function(){
    /*d3.select("#whole-map").select("svg").on("zoom",null)
        .scale(1)
        .translate([0,0]);*/
    var desk = d3.select("#whole-map").select("svg").select("#tables").selectAll("g").selectAll("rect");
    desk.classed("draggable", true)
        .attr("cursor","move")
        .style("cursor","")
        .attr("transform","matrix(1 0 0 1 0 0)")
        .attr("onmousedown","selectElement(evt)");
    
});

//]]>