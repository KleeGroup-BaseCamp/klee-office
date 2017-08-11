/**
 *  Function to build configurations screen
 */

(function(window) {

    //control access to the page
    var server="http://localhost:3000/";
    //var	server = "http://local-map/";
    var myData=[d3.select("#personal-firstname")[0][0].textContent, d3.select("#personal-lastname")[0][0].textContent,"",""];
    var level="none";
    var dep="";
    var comp="";

    d3.json(server + "getLevelValidator/"+myData[0]+"/"+myData[1], function(isValidator){
        //give access to members of his business unit
        if (isValidator[0].isValidatorLvlOne==true && isValidator[0].isValidatorLvlTwo ==false){
            level="1";
            dep=isValidator[0].businessUnit_id;
            comp=isValidator[0].company;
            d3.selectAll("#config-buttons button").style('background-color','black').style('color','white')
            d3.select("#plot-config").style('background-color','white').style('color','black')
            d3.select("#error-conf").style("display","none"); 
            d3.select("#noplace-block").style("display","none"); 
            d3.select("#overDesk-block").style("display","none");         
        }
        //give access to memebers of his company 
        else if (isValidator[0].isValidatorLvlTwo==true){
            level="2"; 
            d3.selectAll("#config-buttons button").style('background-color','black').style('color','white')
            d3.select("#plot-config").style('background-color','white').style('color','black')
            d3.select("#error-conf").style("display","none");
            d3.select("#noplace-block").style("display","none");
            d3.select("#overDesk-block").style("display","none");
            dep="all";
            comp=isValidator[0].company;
        }
        else{
            d3.select(".two-columns").style("display","none");
            d3.select("#error-conf").style("height","auto").style("width","auto").html(" Vous n'avez les droits d'accès à cette page <br/><a href=\""+server+"\"><button class=\"back-index\">Revenir à la page d'accueil</button></a>");
        }
        configurationsControl.plotConfList(level,dep);
        plotNoPlaceList(level,dep,comp);
        plotOverPeopleDesk();
    });

    function plotNoPlaceList(level,dep,comp){
        $('<input type="checkbox" id="all" class="input1" value="all" checked>Tous les départements<br>').appendTo($('#filter-noplace div'))
        d3.json(server+"getDepartmentsByCompany/"+comp,function(error,deps){
            deps.forEach(function(pole){
                $('<input id='+pole.bus_id+' class="input2" type="checkbox" value='+pole.bus_id+'>'+pole.name+'<br>').appendTo($('#filter-noplace div'))
            })
        })    

        loadTable([])

        $("#button-plot-noplace").on("click", function() {
            $('#list-noplace > tr').remove();
            var listDepId=[]
            $('#filter-noplace div input').each(function(){
                if ($(this).is(":checked")){
                    listDepId.push($(this)[0].id)
                }
            })
            loadTable(listDepId);
        });
        $("filter-noplace").on('click','.input2',function(){
            console.log('click')
        })

        function loadTable(listDepId){
            if(listDepId.length==0 || listDepId.indexOf("all")!=-1){
                
                d3.json(server + "getNoPlacePersonByCompany/"+comp+"/", function(person){
                    console.log(person)
                    for (var i=0;i<person.length;i++){
                        var datemaj=person[i].date.replace('T',' ').replace('Z',' ').substring(0,person[i].date.length-5);
                        $("<tr><td>"+person[i].firstname + "</td><td>" + person[i].lastname + '</td><td>'+person[i].mail+'</td><td>'+person[i].businessunit+'</td><td>'+datemaj+'</td><td>'+person[i].status+'</td></tr>').insertAfter($('.table-noplace'));
                    }
                })                     
            }else{
                for (var i=0;i<listDepId.length;i++){
                    var pole=listDepId[i];
                    d3.json(server + "getNoPlacePersonByBusUnit/"+pole+"/"+comp, function(person){
                        for (var i=0;i<person.length;i++){
                            var datemaj=person[i].date.replace('T',' ').replace('Z',' ').substring(0,person[i].date.length-5);
                            $("<tr><td>"+person[i].firstname + "</td><td>" + person[i].lastname + '</td><td>'+person[i].mail+'</td><td>'+person[i].businessunit+'</td><td>'+datemaj+'</td><td>'+person[i].status+'</td></tr>').insertAfter($('.table-noplace'));                
                        }  
                    });
                }
            }
        }
    }

    function plotOverPeopleDesk(){
        d3.json(server + "getOverOccupiedDesk/", function(person){
            for (var i=0;i<person.length;i++){
                    $("<tr><td>"+person[i].desk + "</td><td>" + person[i].firstname + "</td><td>"+ person[i].lastname + "</td><td>"+person[i].pole+ "</td><td>" + person[i].company + "</td></tr>").insertAfter($('.table-overDesk'));       
            }  
        });
    }

    


    // print popin to add a new configuration
    $("#add-title").click(function (event) {
        if(configurationsControl.isPopin !== true){
            $('<div id="popin-add">'+
                '<h3>Cr&eacuteer une nouvelle configuration</h3>'+
                '<br><br><br>'+
                '<form  id="formNewConfig">'+
                    '<div class="inline left-labels">'+
                        '<label for="name">Nom (*) : </label><br /><br />'+
                        '<label for="creator">Auteur : </label><br /><br />'+
                        '<label for="dateCreation">Date : </label><br /><br />'+
                    '</div>'+ 
                    '<div class="inline">'+
                        '<input class="field" type="text" id="name" name="name" required/><br />'+
                        '<input class="disabled-field" type="text" id="creator" name="creator"  value="" readonly /><br />'+
                        '<input class="disabled-field" type="text" id="dateCreation" name="dateCreation" value="" readonly /><br />'+
                    '</div>'+
                    '<div id="popin-button">'+
                        '<input class="submit" id="add-conf" type="submit" value="Valider"/>'+
                        '<input class="submit" id="conf-cancel" type="reset" value="Annuler"/>'+
                    '</div>'+
                '</form>'+
            '</div>').insertAfter($('.two-columns'));
        }
        configurationsControl.isPopin = true;
        var today = new Date().toLocaleDateString();
        d3.select("#dateCreation").attr("value", today);
        d3.select("#creator").attr("value",myData[0]+" "+myData[1]);

        $("#popin-add").click(function (event) {
            event.stopPropagation();
        });
        $("#conf-cancel").click(function () {
            $('#popin-add').remove();
            configurationsControl.isPopin = false;
        }); 

        $(document).on('submit', '#formNewConfig', function(){
            var name = $('#name').val();
            var creator = $('#creator').val();
            d3.json(server +"addNewConfiguration", function(){
                console.log("save my new config !")})
                .header("Content-Type","application/json")
                .send("POST", JSON.stringify({'name': name, 'creator': creator}));  
        })
        
        jQuery('html,body').animate({scrollTop:0},0);
        event.stopPropagation();
    });

    $("html").click(function () {
        if(configurationsControl.isPopin === true){
            $('#popin-add').remove();
            configurationsControl.isPopin = false;
        }
    });

    $("#noplace-toexcel").click(function () {
        window.open('data:application/vnd.ms-excel,' + encodeURIComponent("<table>"+$('#list-noplace').html()+"</table>"));
    });


    $("#plot-noplace").click(function () {
        d3.selectAll("#config-buttons button").style('background-color','black').style('color','white')
        d3.select("#plot-noplace").style('background-color','white').style('color','black')
        d3.select("#conf-block").style("display","none");
        d3.select("#overDesk-block").style("display","none");
        d3.select("#noplace-block") .style("display","");
    });


    $("#plot-config").click(function () {
        d3.selectAll("#config-buttons button").style('background-color','black').style('color','white')
        d3.select("#plot-config").style('background-color','white').style('color','black')
        d3.select("#conf-block").style("display","");
        d3.select("#overDesk-block").style("display","none");
        d3.select("#noplace-block").style("display","none");
    });

    $("#plot-overDesk").click(function () {
        d3.selectAll("#config-buttons button").style('background-color','black').style('color','white')
        d3.select("#plot-overDesk").style('background-color','white').style('color','black')
        d3.select("#conf-block").style("display","none");
        d3.select("#overDesk-block").style("display","");
        d3.select("#noplace-block").style("display","none");
    });
    
}(window));