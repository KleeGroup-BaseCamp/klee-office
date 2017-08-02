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
    var valX = selectedElement.getAttribute("x");
    var valY = selectedElement.getAttribute("y")
    var dX = selectedElement.getAttribute("transform").split(/\(/)[1].split(/\s/)[4];
    var dY = selectedElement.getAttribute("transform").split(/\(/)[1].split(/\s/)[5].split(/\)/)[0];
    var parseX = new Number(dX);
    var parseY = new Number(dY);
    var parsevalX = new Number(valX);
    var parsevalY = new Number(valY);
    var newX = parsevalX + (parseX);
    var newY = parsevalY + (parseY);
    
    console.log("deselectElement");
    console.log(selectedElement);
    console.log("ParseX : " + parseX);
    console.log("ParseX : " + parseY);
    console.log("x = " + valX);
    console.log("y = " + valY);
    console.log("matrix dX = " + dX);
    console.log("matrix dY = " + dY);
    console.log("newX = " + newX);
    console.log("newY = " + newY);
    
  if(selectedElement != 0){ 
    /*selectedElement.setAttribute("x",newX);  
    selectedElement.setAttribute("x",newY); */
    /*d3.select(selectedElement).attr("x",newX).attr("y",newY);*/
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

$("#quit-admin").click(function(){
    console.log("gohan");
    var i=0;
    var desk = d3.select("#whole-map").select("svg").select("#tables").selectAll("g").selectAll("rect");
    var desk2, valX, valY, dX, dY, parseX, parsevalY, newX, newY;
    for(i=0;i<desk.length;i++){
        desk2 = desk[i][0];
        valX = desk2.getAttribute("x");
        valY = desk2.getAttribute("y")
        dX = desk2.getAttribute("transform").split(/\(/)[1].split(/\s/)[4];
        dY = desk2.getAttribute("transform").split(/\(/)[1].split(/\s/)[5].split(/\)/)[0];
        parseX = new Number(dX);
        parseY = new Number(dY);
        parsevalX = new Number(valX);
        parsevalY = new Number(valY);
        newX = parsevalX + (parseX);
        newY = parsevalY + (parseY);

        // à tester avec removeAttribute()
        desk2.setAttribute("transform", "");
        desk2.setAttribute("class", "");
        desk2.setAttribute("cursor","pointer");
        desk2.setAttribute("onmousedown", "");
        desk2.setAttribute("x",newX);
        desk2.setAttribute("y",newY);
    }
});

$("#dl-button").click(function(){
    d3.select("#whole-map").select("svg").selectAll("g").select("image").remove();
    var svgData = document.getElementsByClassName("map")[0].outerHTML;
    console.log(svgData);
    var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    console.log(svgUrl);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "testmap.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});


var fileInput = document.querySelector('#upload-file'),
    progress = document.querySelector('#upload-progress');

fileInput.addEventListener('change', function() {

    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:3000/admin'); //erreur !!

    xhr.upload.addEventListener('progress', function(e) {
        progress.value = e.loaded;
        progress.max = e.total;
    }, false);

    xhr.addEventListener('load', function() {
        alert('Upload terminé !');
    }, false);

    var form = new FormData();
    form.append('file', fileInput.files[0]);

    xhr.send(form);

}, false);

    
