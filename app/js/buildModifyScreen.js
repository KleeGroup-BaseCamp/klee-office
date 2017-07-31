
/**
 * Created by msalvi on 08/09/2016.
 */
(function(window) {
    var server="http://localhost:3000/";
    //var server= "http://local-map/"
    var people = [];            //contains data about every person
    var sitesExterne=["Issy-les-Moulineaux","Le Mans","Lyon","Bourgoin-Jailleux","Montpellier","Sur site client"];
    var mapNames = ["N0", "N1", "N2", "N3", "N4", "O4", "O3", "O2","O1"];
    var myData=[d3.select("#personal-firstname")[0][0].textContent, d3.select("#personal-lastname")[0][0].textContent,"",""];
    var newConfig=[];
    var configId=window.location.href.split('modify')[1]
    function fillMyData(myData,callback){
        d3.json(server + "currentOfficeName/" + myData[0] + "/" + myData[1], function(err, res){
            if (res.length>0){
             if (res[0].site=="La Boursidière"){
                myData[2] = res[0].name;
                myData[3]= res[0].site;}
             else if (res[0].site !==undefined ||res[0].site !=="" ||res[0].site !=="aucun"){
                myData[2] = "externe";
                myData[3]= res[0].site;}
             else{
                myData[2] = "aucun";
                myData[3]= "aucun";}
            }        
            else{
                myData[2] = "aucun";
                myData[3]= "aucun";
            };    
            callback();
        })
    }
    fillMyData(myData,function(){});

    function getnames(name){
        var names=name.split(' ')
        var firstname='',lastname='';
        for (var i=0;i<names.length;i++){
            if (names[i]!=''){
                if (names[i]==names[i].toUpperCase()){
                        lastname+=names[i]+" "
                }else{
                    firstname+=names[i]+" "
                }
            }
        }
        firstname=firstname.substring(0,firstname.length-1)
        lastname=lastname.substring(0,lastname.length-1)
        return([firstname,lastname])
    }

    function preparePlot() {
        var mapName="N0";
        if(!mapControl.existMap) {
            // erase all maps' overview
            mapControl.mapName = mapName;
            mapControl.mapPlot(myData,mapName, false, function() {});
            mapControl.existMap = true;
        }
        // if a map exists, erase it and replot one 
        else {
            d3.select(".map").select("svg").remove();
            mapControl.existMap = false;
            mapControl.mapName = mapName;
            mapControl.mapPlot(myData,mapName, false, function() {});
            mapControl.existMap = true;
        }
        $("#text-conf").html("Veuillez rechercher la personne à déplacer")
        d3.select("#menu-withoutresult").style("display","");
        d3.select("#menu-conf").style("display","none");
        d3.json(server + "getRecapOfMovings/"+configId, function(movelines){
            console.log(movelines)
            for (var i=0;i<movelines.length;i++){
                newConfig.push([movelines[i].firstname,movelines[i].lastname,movelines[i].depart,movelines[i].arrivee])
                $("<tr><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td>"+newConfig[newConfig.length-1][3]+"</td><td class=delete-moveline></td></tr>").appendTo("#table-to-fill")
            }  
            $('.delete-moveline').click(function(event){
                console.log(event.target.parentNode.childNodes)
                console.log(configId)
                $.ajax({
                        url: "deleteMoveline/"+configId+'/'+event.target.parentNode.childNodes[1].innerText+'/'+event.target.parentNode.childNodes[0].innerText,
                        type: 'DELETE',
                        success: function(result) {
                          window.location.href = server+"configurations/"+configId;
                        }
                });
            })  
        });
                

    }
    preparePlot();

    function chooseSite(name) {
        var mysite=d3.event.target.id.split(/_/)[0];
        if (mysite=="boursidiere"){
            return;
        }
        else{
            for (var i=0;i<sitesExterne.length;i++){
                if (sitesExterne[i].search(mysite)!=-1){
                    newsite=sitesExterne[i];
                }
            }
            validateSite(newsite);
        }
    }
    function chooseArea(name){
        var etage = document.querySelector(d3.event.target.id);
        var myMap=d3.event.target.id.split(/_/)[0];
		// if no map, show mapN0
		if (!mapControl.existMap) {
			mapControl.mapName = myMap;
			mapControl.mapPlot(myData,mapControl.mapName,true, function() {validateDesk(name)});
			mapControl.existMap = true;
		}
		// if other map, delete and show mapN0
		else if (mapControl.mapName !== myMap) {
			d3.select(".map").select("svg").remove();
			mapControl.mapName = myMap;
			mapControl.mapPlot(myData,mapControl.mapName,true, function() {validateDesk(name)});
		}
    }
    function validateDesk(name){
        //need to choose a new desk
	    var allTables = d3.select("#tables").selectAll("g")
        console.log(allTables)
        allTables.style("cursor", "pointer")
        allTables.on("click", function(){
			var newDesk = d3.event.target.parentNode.id;
            var newsite="La Boursidière";
            console.log(newDesk)
            d3.json(server + "getPersonByDesk/"+newDesk, function(isDeskAvailable){
                    if (isDeskAvailable.length===0){
                        d3.select("#text-conf").html("Vous souhaitez déplacer "+name+" au bureau "+newDesk
                            +"<br/>Voules-vous ajouter ce déplacement à la configuration ?"+
                            "<button id=\"val-conf-move\" >Valider</button>"+
                            "<button id=\"can-conf-move\"><a href='"+server+"'>Annuler</a></button>");
                        document.getElementById("val-conf-move").onclick = function() {validateMove(name,newsite,newDesk)};
                    }
                    else{
                         d3.select("#text-conf").html("ATTENTION vous avez choisi le bureau "+newDesk
                            +" qui déjà occupé par "+isDeskAvailable[0].firstname+" "+isDeskAvailable[0].lastname
                            +"<br/>Voulez-vous déplacer "+name+" à ce bureau ?"+
                            "<button id=\"val-conf-move\" >Valider</button>"+
                            "<button id=\"can-conf-move\"><a href='"+server+"'>Annuler</a></button>");
                        document.getElementById("val-conf-move").onclick = function() {validateMove(name,newsite,newDesk)};
                    }
            });
		});
        //document.getElementById("can-conf-move").addEventListener("click", function() {event.stopPropagation()})
        return
    }
    function validateSite(newsite){ 
        d3.select("#text-conf").html("Vous souhaitez déplacer "+name+" sur le site "+newsite
                            +"<br/>Voules-vous ajouter ce déplacement à la configuration ?</br>"+
                            "<button id=\"val-conf-move\" >Valider</button>"+
                            "<button id=\"can-conf-move\"><a href=\""+server+"\">Annuler</a></button>");
        document.getElementById("val-conf-move").onclick = function() {validateMove(name,newsite,"externe")};
    }
    function validateMove(name,site,desk){
        var firstname=getnames(name)[0];
        var lastname=getnames(name)[1];
        d3.json(server + "currentOfficeName/"+firstname+'/'+lastname, function(formerDesk){
            var formerLocation=''
            if (formerDesk[0].site!="La Boursidière"){
                formerLocation=formerDesk[0].site
            }else {formerLocation=formerDesk[0].site+' : '+formerDesk[0].name}
            newConfig.push([firstname,lastname,formerLocation,site+' : '+desk])
            $("<tr><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td>"+newConfig[newConfig.length-1][3]+"</td><td class=delete-moveline></td></tr>").appendTo("#table-to-fill")
        });
        d3.json(server + "getPersonByDesk/"+desk, function(isDeskAvailable){
            if (isDeskAvailable.length!==0){
                console.log(isDeskAvailable)
                newConfig.push([isDeskAvailable[0].firstname,isDeskAvailable[0].lastname,"La Boursidière  : "+desk,"La Boursidière  : aucun"])
                $("<tr><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td>"+newConfig[newConfig.length-1][3]+"</td><td class=delete-moveline></td></tr>").appendTo("#table-to-fill")
            }
            $("#nb-people-new-conf").html(newConfig.length)
        });
        $("#text-conf").html("Veuillez rechercher la personne à déplacer")
    }

    // arrange data in the form like [{ value: 'string', data: any }, ... ]
    // element example: ["CN=Laurence EYRAUD-JOLY,OU=Klee SA,OU=Utilisateurs,DC=KLEE,DC=LAN,DC=NET", 
    //                  { "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }]
    // only need element[1]
    function getName(element, index, array){
        people.push({value: element[1].cn[0], data: element[1]});
    }

    $.getJSON(server+'people', function(data) {
        //data is the JSON file
        data.forEach(getName);

        // setup autocomplete function pulling from people[] array
        $('#search-one-term')
        .autocomplete({
            lookup: people,
            onSelect: function (suggestion) {
                var table,
                    mapName,
                    site,
                    desk;

            // suggestion.data example: 
            //      { "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }
            d3.select("#menu-withoutresult").style("display","none");
            d3.select("#menu-conf").style("display","");
            
            if (suggestion.data.physicalDeliveryOfficeName) {
                var location=suggestion.data.physicalDeliveryOfficeName[0]
                console.log(suggestion.data.physicalDeliveryOfficeName)
                if (location.split(' : ').length==2){
                    site=location.split(' : ')[0];
                    desk=location.split(' : ')[1];
                    mapName=desk.substring(0,2);
                }
                else{
                    site=location;
                    desk="aucun";
                    mapName="None";
                }
                d3.select("#text-conf").html(suggestion.data.cn+' est localisé '+location+'</br>Sélectionnez son nouvel emplacement')
                
                if (mapName!="None"){
                    d3.selectAll(".site-conf").style("font-weight","normal");
                    d3.selectAll("#etages_conf").style("font-weight","normal");
                    d3.select("#"+mapName+"_conf").style("font-weight","bold");
                    // if no map showing on, plot the map with name "mapName", add pin to searched person's table
                    if(!mapControl.existMap) {
                        // erase all maps' overview
                       // mapControl.eraseMap();
                        mapControl.mapName = mapName;
                        mapControl.mapPlot(myData,mapName, true, function() {
                            table = d3.select("#tables")
                                        .select("#" + desk);
                            table.append("image")
                                .attr("xlink:href", "./img/pin_final.png")
                                .attr("width", "30")
                                .attr("height", "50")
                                .attr("x", table.select("rect").attr("x") - 10)
                                .attr("y", table.select("rect").attr("y") - 40);
                            validateDesk(suggestion.data.cn[0]);
                        });
                        mapControl.existMap = true;
                    }
                    // if a map exists, erase it and replot one 
                    else {
                        d3.select(".map").select("svg").remove();
                        mapControl.existMap = false;
                        mapControl.mapName = mapName;
                        mapControl.mapPlot(myData,mapName, true, function() {
                            table = d3.select("#tables")
                                        .select("#" + desk);
                            table.append("image")
                                .attr("xlink:href", "./img/pin_final.png")
                                .attr("width", "30")
                                .attr("height", "50")
                                .attr("x", table.select("rect").attr("x") - 10)
                                .attr("y", table.select("rect").attr("y") - 40); 
                            validateDesk(suggestion.data.cn[0]);
                        });
                        mapControl.existMap = true;
                    }

                }
                else{validateDesk(suggestion.data.cn[0])
                }

                d3.selectAll(".site-conf").on("click",function() {
                    chooseSite(suggestion.data.cn[0]);
                });
                d3.selectAll("#etages_conf").on("click",function() {
                    chooseArea(suggestion.data.cn[0])
                });


            }
 
        }
        });
    });

    $("#can-conf").click(function(event){
         window.location.href = server+"configurations";
    });
    $('#val-conf').click(function(event){
        console.log('save the movelines')
    })


}(window));