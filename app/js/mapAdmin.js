var selectedElement = 0;
var currentX = 0;
var currentY = 0;
var currentMatrix = 0;


// --- function to select Desk Element ---- //

function selectElement(evt) {
    selectedElement = evt.target;
    currentX = evt.clientX;
    currentY = evt.clientY;
    currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7, -1).split(' ');

    for (var i = 0; i < currentMatrix.length; i++) {
        currentMatrix[i] = parseFloat(currentMatrix[i]);
    }
    selectedElement.setAttributeNS(null, "onmousemove", "moveElement(evt)");
    selectedElement.setAttributeNS(null, "onmouseout", "deselectElement(evt)");
    selectedElement.setAttributeNS(null, "onmouseup", "deselectElement(evt)");
}

// --- function to move Desk Element ---- //

function moveElement(evt) {
    var coef=1;
    if (d3.select('#map-name h1').attr('class')=='N0'){
        coef=2;
    }
    dx = evt.clientX - currentX;
    dy = evt.clientY - currentY;
    currentMatrix[4] += dx*coef;
    currentMatrix[5] += dy*coef;
    newMatrix = "matrix(" + currentMatrix.join(' ') + ")";

    selectedElement.setAttributeNS(null, "transform", newMatrix);
    currentX = evt.clientX;
    currentY = evt.clientY;
}

// --- function to deselect Desk Element ---- //

function deselectElement(evt) {
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

    /*console.log("deselectElement");
    console.log(selectedElement);
    console.log("ParseX : " + parseX);
    console.log("ParseX : " + parseY);
    console.log("x = " + valX);
    console.log("y = " + valY);
    console.log("matrix dX = " + dX);
    console.log("matrix dY = " + dY);
    console.log("newX = " + newX);
    console.log("newY = " + newY);*/

    if (selectedElement != 0) {
        selectedElement.removeAttributeNS(null, "onmousemove");
        selectedElement.removeAttributeNS(null, "onmouseout");
        selectedElement.removeAttributeNS(null, "onmouseup");
        selectedElement = 0;
    }
}

// --------- Enter to admin mode : Start changes to SVG map ------- //

$("#mode-admin").click(function () {
    /*d3.select("#whole-map").select("svg").on("zoom",null)
        .scale(1)
        .translate([0,0]);*/
    d3.select("#whole-map").select("svg").call(d3.behavior.zoom().on("zoom", null));
    d3.select(".tooltip_map_desk").remove();
    d3.select(".tooltip_map_desk_empty").remove();
    var desk = d3.select("#whole-map").select("svg").select("#tables").selectAll("g").selectAll("rect");
    var img = d3.select("#whole-map").select("svg").selectAll("g").selectAll("image");
    desk.classed("draggable", true)
        .attr("cursor", "move")
        .style("cursor", "")
        .attr("stroke", "#ff00ff")
        .attr("transform", "matrix(1 0 0 1 0 0)")
        .attr("onmousedown", "selectElement(evt)");
    img.classed("draggable", true)
        .attr("cursor", "move")
        .style("cursor", "")
        .attr("transform", "matrix(1 0 0 1 0 0)")
        .attr("onmousedown", "selectElement(evt)")
        //.attr("onclick", "sizePlus(evt)")
        //.attr("oncontextmenu", "sizeLess(evt)");
});

function sizePlus(evt) {
    //console.log("yamcha");
    selectedElement = evt.target;
    //console.log(selectedElement);
    var newWidth = Number(selectedElement.getAttribute("width")) + 5;
    var newHeight = Number(selectedElement.getAttribute("height")) + 5;
    //console.log(newWidth + " -- " + newHeight);
    d3.select(selectedElement).attr("width", newWidth)
        .attr("height", newHeight);
}

function sizeLess(evt) {
    //console.log("chichi");
    evt.preventDefault();
    selectedElement = evt.target;
    //console.log(selectedElement);
    var newWidth = Number(selectedElement.getAttribute("width")) - 5;
    var newHeight = Number(selectedElement.getAttribute("height")) - 5;
    //console.log(newWidth + " -- " + newHeight);
    d3.select(selectedElement).attr("width", newWidth)
        .attr("height", newHeight);
}
$('#plus-size').click(function(){
    $('.map image').one('click',function(event){
        sizePlus(event);
        d3.select(".map image").style('cursor','pointer')
        event.stopPropagation();
    })
    
})
$('#minus-size').click(function(){
    $('.map image').one('click',function(event){
        sizeLess(event);
        d3.select(".map image").style('cursor','pointer')
        event.stopPropagation();
    })
    
})
// ------ Leave Admin Mode :  Keep changes to SVG map ------ //

$("#quit-admin").click(function () {
    var i = 0;
    var desk = d3.select("#whole-map").select("svg").select("#tables").selectAll("g").selectAll("rect");
    var img = d3.select("#whole-map").select("svg").selectAll("g").selectAll("image");
    var desk2, img2, valX, valY, dX, dY, parseX, parsevalY, newX, newY;

    // valider les bureaux
    for (i = 0; i < desk.length; i++) {
        desk2 = desk[i][0];
        //console.log(desk2);
        if (desk2 !== undefined) {
            if (desk2.getAttribute("transform")) {
                if (desk2.getAttribute("transform") !== "") {
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
                    desk2.setAttribute("x", newX);
                    desk2.setAttribute("y", newY);

                }
            }
            desk2.setAttribute("transform", "");
            desk2.setAttribute("class", "");
            desk2.setAttribute("cursor", "pointer");
            desk2.setAttribute("onmousedown", "");
            desk2.setAttribute("stroke", "black");
        }

        // à tester avec removeAttribute()
        //desk2.removeAttribute("transform");
    }

    //console.log(img);
    //console.log(img.length);
    // valider les images  
    for (i = 0; i < img.length; i++) {
        img2 = img[i][0];
        //console.log(img2);
        if (img2 !== undefined) {
            if (img2.getAttribute("transform")) {
                if (img2.getAttribute("transform") !== "") {
                    valX = img2.getAttribute("x");
                    valY = img2.getAttribute("y");
                    dX = img2.getAttribute("transform").split(/\(/)[1].split(/\s/)[4];
                    dY = img2.getAttribute("transform").split(/\(/)[1].split(/\s/)[5].split(/\)/)[0];
                    parseX = new Number(dX);
                    parseY = new Number(dY);
                    parsevalX = new Number(valX);
                    parsevalY = new Number(valY);
                    newX = parsevalX + (parseX);
                    newY = parsevalY + (parseY);
                    img2.setAttribute("x", newX);
                    img2.setAttribute("y", newY);
                }
            }
            img2.setAttribute("transform", "");
            img2.setAttribute("class", "");
            img2.setAttribute("cursor", "pointer");
            img2.setAttribute("onmousedown", "");
            img2.setAttribute("stroke", "black");
            img2.setAttribute("onclick", "")
            img2.setAttribute("oncontextmenu", "");
        }
    }
});

// ------ Download SVG map --------- //

$("#dl-button").click(function () {
    
    var svg1 = document.getElementsByTagName('svg')[1];
    var svgData = svg1.outerHTML;
    var mapName = d3.select("#map-name h1")[0][0].className;
    //console.log(svgData);
    var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);
    //console.log(svgUrl);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = mapName + ".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

// ------ Add new desk on map ------- //

$("#add-desk-vertical").click(function () {
    plot_nameConsole();
    d3.select("#whole-map").select("svg").call(d3.behavior.zoom().on("zoom", null));
    d3.select(".tooltip_map_desk").remove();
    d3.select(".tooltip_map_desk_empty").remove();

    $("#add-office").click(function () {
        var floorName = $('#floor').val();
        var zoneName = $('#zone').val();
        var numeroName = $('#numero').val();
        var expZone = /[A-Z]/;
        var expNumero = /[0-9][0-9]/;
        var deskName = floorName + "-" + zoneName + "-" + numeroName;

        if ((zoneName.match(expZone)) || (numeroName.match(expNumero))) {
            if ((zoneName === zoneName.match(expZone)[0]) && (numeroName === numeroName.match(expNumero)[0])) {
                if (d3.select("#tables").select("#" + deskName)[0][0] === null) {
                    
                    $("#newDesk-add").remove();
                    //Get svg element with all desks
                    var mapTables=$('.map svg #tables')[0]
                    console.log(mapTables)

                    var newDesk = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                    newDesk.setAttribute("id", deskName); //modifier l'id pour pas que ce soit le même à chaque ajout
                    newDesk.setAttribute("class", "available");
                    newDesk.setAttribute("cursor", "pointer");
                    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
                    rect.setAttribute("fill", "#99ff99"); //Set path's data
                    rect.setAttribute("fill-opacity", "0.66");
                    rect.setAttribute("cursor", "pointer");
                    rect.setAttribute("width", "12.776915");
                    rect.setAttribute("height", "25.906563");
                    rect.setAttribute("x", "930");
                    rect.setAttribute("y", "375");
                    rect.setAttribute("stroke", "black");                    
                    newDesk.appendChild(rect);
                    console.log(newDesk)

                    mapTables.appendChild(newDesk)

                } else {
                    d3.select("#wrong-exp").style("visibility", "visible").html("Nom déjà utilisé");
                }
            }
        } else {
            d3.select("#wrong-exp").style("visibility", "visible").html("Nom invalide");
        }
    })
});

$("#add-desk-horizontal").click(function () {
    plot_nameConsole();
    d3.select("#whole-map").select("svg").call(d3.behavior.zoom().on("zoom", null));
    d3.select(".tooltip_map_desk").remove();
    d3.select(".tooltip_map_desk_empty").remove();

    $("#add-office").click(function () {
        var floorName = $('#floor').val();
        var zoneName = $('#zone').val();
        var numeroName = $('#numero').val();
        var expZone = /[A-Z]/;
        var expNumero = /[0-9][0-9]/;
        var deskName = floorName + "-" + zoneName + "-" + numeroName;

        if ((zoneName.match(expZone)) || (numeroName.match(expNumero))) {
            if ((zoneName === zoneName.match(expZone)[0]) && (numeroName === numeroName.match(expNumero)[0])) {
                if (d3.select("#tables").select("#" + deskName)[0][0] === null) {

                    $("#newDesk-add").remove();
                    //Get svg element with all desks
                    var mapTables=$('.map svg #tables')[0]
                    var newDesk = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                    newDesk.setAttribute("id", deskName); //modifier l'id pour pas que ce soit le même à chaque ajout
                    newDesk.setAttribute("class", "available");
                    newDesk.setAttribute("style", "cursor:pointer");
                    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
                    rect.setAttribute("fill", "#99ff99"); //Set path's data
                    rect.setAttribute("fill-opacity", "0.66");
                    rect.setAttribute("width", "25.906563");
                    rect.setAttribute("height", "12.776915");
                    rect.setAttribute("x", "930");
                    rect.setAttribute("y", "375");
                    rect.setAttribute("stroke", "black");                    
                    newDesk.appendChild(rect);
                    mapTables.appendChild(newDesk)

                } else {
                    d3.select("#wrong-exp").style("visibility", "visible").html("Nom déjà utilisé");
                }
            }
        } else {
            d3.select("#wrong-exp").style("visibility", "visible").html("Nom invalide");
        }
    })
});

// ----- function to plot "Enter name of new desk" ------- //

function plot_nameConsole() {
    $('<div id="newDesk-add">' +
        '<h3>Ajouter un nouveau bureau</h3>' +
        '<br><br><br>' +
        '<div class="inline left-labels">' +
        '<label for="floor-name">Etage (*) : </label><br /><br />' +
        '<label for="zone-name">Zone : </label><br /><br />' +
        '<label for="numero-name">Numéro : </label><br /><br />' +
        '</div>' +
        '<div class="inline">' +
        '<input class="field" type="text" id="floor" name="etage" value="' + d3.select("#map-name h1")[0][0].className + '" readonly/><br />' +
        '<input class="field" type="text" id="zone" name="zone" placeholder="A-Z" required/><br />' +
        '<input class="field" type="text" id="numero" name="numero" placeholder="01-99" required/><br />' +
        '</div>' +
        '<div id="newDesk-button">' +
        '<button id="add-office">Valider</button>' +
        '<button id="office-cancel">Annuler</button><br/>' +
        '<p id="wrong-exp">Nom invalide</p>' +
        '</div>' +
        '</div>').insertAfter($('#navigation-bar'));

    $("#office-cancel").click(function () {
        $("#newDesk-add").remove();
    });
}

// ------- Remove desk on map ------ //

$("#rm-desk").click(function () {
    d3.select("#whole-map").select("svg").call(d3.behavior.zoom().on("zoom", null));
    d3.select("#whole-map").select("svg").selectAll("g").select("#pin_home").remove();
    d3.select(".tooltip_map_desk").remove();
    d3.select(".tooltip_map_desk_empty").remove();

    var desk = d3.select("#whole-map").select("svg").select("#tables").selectAll(".available").selectAll("rect");
    var img = d3.select("#whole-map").select("svg").selectAll("image");
    desk.attr("cursor", "pointer")
        .attr("onmousedown", "removeElement(evt)")
        .attr("stroke", "red");
    img.attr("cursor", "pointer")
        .attr("onmousedown", "removeElement(evt)")
    //d3.select("#whole-map").select("svg").select("#tables").selectAll(".available").selectAll("rect").attr("stroke","red")

});

// ---- function to remove desk ----- //

function removeElement(evt) {
    selectedElement = evt.target.parentElement;
    selectedElement.remove();
}

$("#undo-map").click(function () {
    var mapName = d3.select("#map-name h1")[0][0].className;
    d3.select(".map").select("svg").remove();
    mapControl.mapName = mapName;
    mapControl.mapPlot(myData, mapControl.mapName, false, function () { });
});

// -------- plot Upload file -------- //

function getfile() {
    document.getElementById('fileInput').click();
}

function getFileName(){
    document.getElementById('import-map').innerHTML=document.getElementById('fileInput').value.split(/\\/)[2];
}


function getImg() {
    document.getElementById('imgInput').click();
}

function getImgName(){
    document.getElementById('import-image').innerHTML=document.getElementById('imgInput').value.split(/\\/)[2];
}

plotIcons();

$("#gallery-icons").click(function () {
    d3.select("#icons").style("display", "");
    d3.select("#close-image").style("display", "");
    d3.select("#gallery-icons").style("display", "none");
});

$("#close-image").click(function () {
    d3.select("#icons").style("display", "none");
    d3.select("#close-image").style("display", "none");
    d3.select("#gallery-icons").style("display", "");
});

// --- Add image from the gallery ---- //

$(document).on("click", "#icons img", function (evt) {
    //alert("coucou");
    d3.select("#whole-map").select("svg").call(d3.behavior.zoom().on("zoom", null));
    d3.select(".tooltip_map_desk").remove();
    d3.select(".tooltip_map_desk_empty").remove();
    /*var time = Date.now();
                var imgName = evt.target.id + time;
                console.log(imgName);
                console.log(time);
                console.log(evt.target.id);*/

        plot_imgName();
        $("#add-img").click(function () {
            var imgName = $('#imgName').val().replace(/ /g,"_");
            if (d3.select("#tables").select("#" + imgName)[0][0] === null) {
                $("#newImg-add").remove();
                var img1 = document.getElementsByTagName('svg')[1]; //Get svg element
                var newElement1 = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                newElement1.setAttribute("id", imgName); //modifier l'id pour pas que ce soit le même à chaque ajout
                newElement1.setAttribute("cursor", "pointer");
                newElement1.setAttribute("stroke", "black");
                newElement1.setAttributeNS(null, 'visibility', 'visible');
                img1.appendChild(newElement1);

                var img2 = document.getElementsByTagName('svg')[1].getElementById(imgName);
                var newElement2 = document.createElementNS("http://www.w3.org/2000/svg", 'image'); //Create a path in SVG's namespace
                newElement2.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "img/icons/" + evt.target.id);
                newElement2.setAttributeNS(null, 'x', '930');
                newElement2.setAttributeNS(null, 'y', '375');
                newElement2.setAttributeNS(null, 'width', '30');
                newElement2.setAttributeNS(null, 'height', '30');
                newElement2.setAttribute("cursor", "pointer");
                newElement2.setAttributeNS(null, 'visibility', 'visible');
                //newElement2.setAttribute("strokeWidth","5px");
                img2.appendChild(newElement2);
            }else {
                    d3.select("#wrong-exp").style("visibility", "visible").html("Nom déjà utilisé");
            }
        });
});

function plot_imgName() {
    $('<div id="newImg-add">' +
        '<h3>Ajouter une nouvelle image</h3>' +
        '<br><br><br>' +
        '<div class="inline left-labels">' +
        '<label for="newImg-name">Nom (*) : </label><br /><br />' +
        '</div>' +
        '<div class="inline">' +
        '<input class="field" type="text" id="imgName" name="imgName" required/><br />' +
        '</div>' +
        '<div id="newImg-button">' +
        '<button id="add-img">Valider</button>' +
        '<button id="img-cancel">Annuler</button><br/>' +
        '<p id="wrong-exp">Nom invalide</p>' +
        '</div>' +
        '</div>').insertAfter($('#navigation-bar'));

    $("#img-cancel").click(function () {
        $("#newImg-add").remove();
    });
}

function plotIcons() {
    var icons = document.getElementById("myIcons").innerText;
    var tabIcons = icons.split(",");
    console.log(tabIcons);
    for (var i = 0; i < tabIcons.length; i++) {
        $('<img class="addIcons" id="' + tabIcons[i] + '" src=img/icons/' + tabIcons[i] + ' width="35px" height="35px">').prependTo($('#icons'));
    }
}



