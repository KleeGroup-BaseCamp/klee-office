var selectedElement = 0;
var currentX = 0;
var currentY = 0;
var currentMatrix = 0;

// --- function to select Desk Element ---- //

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

// --- function to move Desk Element ---- //

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

// --- function to deselect Desk Element ---- //

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
    selectedElement.removeAttributeNS(null, "onmousemove");
    selectedElement.removeAttributeNS(null, "onmouseout");
    selectedElement.removeAttributeNS(null, "onmouseup");
    selectedElement = 0;
  }
}

// --------- Enter to admin mode : Start changes to SVG map ------- //

$("#mode-admin").click(function(){
    /*d3.select("#whole-map").select("svg").on("zoom",null)
        .scale(1)
        .translate([0,0]);*/
    d3.select("#whole-map").select("svg").call(d3.behavior.zoom().on("zoom", null));
    d3.select(".tooltip_map_desk").remove();
    d3.select(".tooltip_map_desk_empty").remove();
    var desk = d3.select("#whole-map").select("svg").select("#tables").selectAll("g").selectAll("rect");
    desk.classed("draggable", true)
        .attr("cursor","move")
        .style("cursor","")
        .attr("stroke","#ff00ff")
        .attr("transform","matrix(1 0 0 1 0 0)")
        .attr("onmousedown","selectElement(evt)");
});

// ------ Leave Admin Mode :  Keep changes to SVG map ------ //

$("#quit-admin").click(function(){
    console.log("gohan");
    var i=0;
    var desk = d3.select("#whole-map").select("svg").select("#tables").selectAll("g").selectAll("rect");
    var desk2, valX, valY, dX, dY, parseX, parsevalY, newX, newY;
    for(i=0;i<desk.length;i++){
        desk2 = desk[i][0];
        console.log(desk2);
        if (desk2 !== undefined){
            if (desk2.getAttribute("transform")){
                if (desk2.getAttribute("transform") !== ""){
                    valX = desk2.getAttribute("x");
                    valY = desk2.getAttribute("y");
                    dX = desk2.getAttribute("transform").split(/\(/)[1].split(/\s/)[4];
                    dY = desk2.getAttribute("transform").split(/\(/)[1].split(/\s/)[5].split(/\)/)[0];
                    parseX = new Number(dX);
                    parseY = new Number(dY);
                    parsevalX = new Number(valX);
                    parsevalY = new Number(valY);
                    newX = parsevalX + (parseX);
                    newY = parsevalY + (parseY);
                    desk2.setAttribute("x",newX);
                    desk2.setAttribute("y",newY);
                    
                }
            }
            desk2.setAttribute("transform", "");
            desk2.setAttribute("class", "");
            desk2.setAttribute("cursor","pointer");
            desk2.setAttribute("onmousedown", "");
            desk2.setAttribute("stroke", "black");
        }

        // à tester avec removeAttribute()
        //desk2.removeAttribute("transform");
        
        
    }
});

// ------ Download SVG map --------- //

$("#dl-button").click(function(){
    d3.select("#whole-map").select("svg").selectAll("g").select("image").remove();
    var svg1 = document.getElementsByTagName('svg')[1];
    var svgData = svg1.outerHTML;
    var mapName = d3.select("#map-name h1")[0][0].className;
    console.log(svgData);
    var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    console.log(svgUrl);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = mapName+".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

// ------ Add new desk on map ------- //

$("#add-desk-vertical").click(function(){
    plot_nameConsole();

    $("#add-office").click(function(){
            var floorName = $('#floor').val();
            var zoneName = $('#zone').val();
            var numeroName = $('#numero').val(); 
            var expZone = /[A-Z]/;
            var expNumero = /[0-9][0-9]/;
            var deskName = floorName+"-"+zoneName+"-"+numeroName;

            if ((zoneName.match(expZone)) || (numeroName.match(expNumero))){
                if ((zoneName === zoneName.match(expZone)[0]) && (numeroName === numeroName.match(expNumero)[0])){
                    if(d3.select("#tables").select("#"+deskName)[0][0] === null){
                    
                        $("#newDesk-add").remove();
                        var svg1 = document.getElementsByTagName('svg')[1].getElementById("tables"); //Get svg element
                        var newElement1 = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                        newElement1.setAttribute("id",deskName); //modifier l'id pour pas que ce soit le même à chaque ajout
                        newElement1.setAttribute("class","available");
                        newElement1.setAttribute("cursor","pointer");
                        svg1.appendChild(newElement1);
                        
                        var svg2 = document.getElementsByTagName('svg')[1].getElementById(deskName);
                        var newElement2 = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
                        newElement2.setAttribute("fill","#99ff99"); //Set path's data
                        newElement2.setAttribute("fill-opacity","0.66");
                        newElement2.setAttribute("cursor","pointer");
                        newElement2.setAttribute("width","12.776915");
                        newElement2.setAttribute("height","25.906563");
                        newElement2.setAttribute("x","930");
                        newElement2.setAttribute("y","375");
                        newElement2.setAttribute("stroke","black");
                        //newElement2.setAttribute("strokeWidth","5px");
                        svg2.appendChild(newElement2);
                    }else{
                        d3.select("#wrong-exp").style("visibility", "visible").html("Nom déjà utilisé");
                    }
                }
            }else{
                d3.select("#wrong-exp").style("visibility", "visible").html("Nom invalide");
            }     
    })    
});  

$("#add-desk-horizontal").click(function(){
    plot_nameConsole();

    $("#add-office").click(function(){
            var floorName = $('#floor').val();
            var zoneName = $('#zone').val();
            var numeroName = $('#numero').val(); 
            var expZone = /[A-Z]/;
            var expNumero = /[0-9][0-9]/;
            var deskName = floorName+"-"+zoneName+"-"+numeroName;

            if ((zoneName.match(expZone)) || (numeroName.match(expNumero))){
                if ((zoneName === zoneName.match(expZone)[0]) && (numeroName === numeroName.match(expNumero)[0])){
                    if(d3.select("#tables").select("#"+deskName)[0][0] === null){
                    
                        $("#newDesk-add").remove();
                        var svg1 = document.getElementsByTagName('svg')[1].getElementById("tables"); //Get svg element
                        var newElement1 = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                        newElement1.setAttribute("id",deskName); //modifier l'id pour pas que ce soit le même à chaque ajout
                        newElement1.setAttribute("class","available");
                        newElement1.setAttribute("cursor","pointer");
                        svg1.appendChild(newElement1);
                        
                        var svg2 = document.getElementsByTagName('svg')[1].getElementById(deskName);
                        var newElement2 = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
                        newElement2.setAttribute("fill","#99ff99"); //Set path's data
                        newElement2.setAttribute("fill-opacity","0.66");
                        newElement2.setAttribute("cursor","pointer");
                        newElement2.setAttribute("width","25.695963");
                        newElement2.setAttribute("height","12.644253");
                        newElement2.setAttribute("x","930");
                        newElement2.setAttribute("y","375");
                        newElement2.setAttribute("stroke","black");
                        //newElement2.setAttribute("strokeWidth","5px");
                        svg2.appendChild(newElement2);
                    }else{
                        d3.select("#wrong-exp").style("visibility", "visible").html("Nom déjà utilisé");
                    }
                }
            }else{
                d3.select("#wrong-exp").style("visibility", "visible").html("Nom invalide");
            }     
    })    
});   

// ----- function to plot "Enter name of new desk" ------- //

function plot_nameConsole(){
    $('<div id="newDesk-add">'+
                '<h3>Ajouter un nouveau bureau</h3>'+
                '<br><br><br>'+
                    '<div class="inline left-labels">'+
                        '<label for="floor-name">Etage (*) : </label><br /><br />'+
                        '<label for="zone-name">Zone : </label><br /><br />'+
                        '<label for="numero-name">Numéro : </label><br /><br />'+
                    '</div>'+ 
                    '<div class="inline">'+
                        '<input class="field" type="text" id="floor" name="etage" value="'+d3.select("#map-name h1")[0][0].className+'" readonly/><br />'+
                        '<input class="field" type="text" id="zone" name="zone" placeholder="Choisir une lettre A-Z" required/><br />'+
                        '<input class="field" type="text" id="numero" name="numero" placeholder="Choisir un nombre 00-99" required/><br />'+
                    '</div>'+
                    '<div id="newDesk-button">'+
                        '<button id="add-office">Valider</button>'+
                        '<button id="office-cancel">Annuler</button><br/>'+
                        '<p id="wrong-exp">Nom invalide</p>'+
                    '</div>'+
            '</div>').insertAfter($('#navigation-bar'));
    
    $("#office-cancel").click(function(){
        $("#newDesk-add").remove();
    });
}

// ------- Remove desk on map ------ //

$("#rm-desk").click(function(){   

    var desk = d3.select("#whole-map").select("svg").select("#tables").selectAll(".available").selectAll("rect");
    desk.attr("cursor","pointer")
        .attr("stroke","red")
        .attr("onmousedown","removeElement(evt)");  
});

// ---- function to remove desk ----- //

function removeElement(evt){
    selectedElement = evt.target;
    selectedElement.remove();
}

$("#undo-map").click(function(){   
		var mapName = d3.select("#map-name h1")[0][0].className;
		d3.select(".map").select("svg").remove();
		mapControl.mapName = mapName;
		mapControl.mapPlot(myData,mapControl.mapName,false, function() {});
});

// -------- plot Upload file -------- //

function getfile(){
    /*document.getElementById('importInput').value=document.getElementById('fileInput').value;*/
    document.getElementById('fileInput').click();
}

