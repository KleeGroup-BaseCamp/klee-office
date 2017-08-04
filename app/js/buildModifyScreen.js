
/**
 * Created by msalvi on 08/09/2016.
 */
(function(window) {
    var server="http://localhost:3000/";
    //var server= "http://local-map/"
    var people = [];            //contains data about every person
    var sitesExterne=["Issy-les-Moulineaux","Le Mans","Lyon","Bourgoin-Jailleux","Montpellier","Sur site client"];
    var myData=[d3.select("#personal-firstname")[0][0].textContent, d3.select("#personal-lastname")[0][0].textContent,"",""];
    var newConfig=[];
    var view_access=false; // true if the config can be modify, false otherwise
    var configId=window.location.href.split('modify')[1] //to get the id of my config

    /**function fillMyData : to get my position (site+desk)**/
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

    /** function getnames : to split a name into firstname and lastname
     * ex: 'Jacques DE MONTMIRAL' -> ['Jacques','DE MONTMIRAL']
     */
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

    /** function plotTable() : remove everything in the current table and do a request on the database to know all movelines for this config
     *  Only configurations which can be modified have a the button delete-moveline
     */
    function plotTable(){

        $('#table-to-fill > tbody').empty();
        newConfig=[];
        d3.json(server + "getRecapOfMovings/"+configId, function(movelines){
            for (var i=0;i<movelines.length;i++){
                var text='';
                newConfig.push([movelines[i].firstname,movelines[i].lastname,movelines[i].depart,movelines[i].arrivee,"former-row"])
                if (view_access==true){
                    text="<tr class=\"former-row\" id='"+newConfig[newConfig.length-1][1]+newConfig[newConfig.length-1][0]+"'><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td>"+newConfig[newConfig.length-1][3]+"</td><td class=delete-moveline></td></tr>"
                }else{
                    text="<tr class=\"former-row\" id='"+newConfig[newConfig.length-1][1]+newConfig[newConfig.length-1][0]+"'><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td>"+newConfig[newConfig.length-1][3]+"</td></tr>"
                }
                $(text).appendTo("#table-to-fill")
            }
            $("#nb-people-new-conf").html(newConfig.length) 
        });
    }

    function updateMovelines(callback){
        d3.json(server+'checkFromDeskMoveLine/'+configId,function(res){
            if (res.length>0){
                for (var i=0;i<res.length;i++){
                    console.log({currentid:res[i].currentid, mov_id: res[i].mov_id})
                    //update the moveline
                    $.ajax({
                        url: "updateFromDeskMoveline",
                        type: 'POST',
                        data:{currentid:res[i].currentid, mov_id: res[i].mov_id},
                        success:function(){
                            console.log('success')
                        }
                    });
                    console.log('update !')
                }
            }
        })
        callback();
}

/** function preparePlot() : plot table ans buttons according to view_access and the map  */
    function preparePlot() {
        d3.json(server + "getConfById/"+configId, function(dataset){
            $("#conf-status").html(dataset[0].state)
            if (dataset[0].state=="Brouillon"){
                view_access=true;
                d3.select("#recap-conf").selectAll('button').style('visibility','visible')
                $("#text-conf").html("Veuillez rechercher la personne à déplacer")
            }else{
                view_acces=false;
                d3.select("#recap-conf").selectAll('button').style('visibility','hidden')
                $("#text-conf").html("Cette configuration n'est pas modifiable")
                $('#table-to-fill th:nth-child(5)').hide();
            }
            updateMovelines(function(){
                plotTable();
            })
        })
        //display a map (mine by default or N0 if none)
        var mapName;
        if (myData[2].split(/-/).length==3){
            myData[2].split(/-/)[1]
        }else{mapName='N0'}

        if(!mapControl.existMap) {
            // erase all maps' overview
            mapControl.mapName = mapName;
            mapControl.confmapPlot(myData,mapName,configId, false, function() {});
            mapControl.existMap = true;
        }
        else {
            d3.select(".map").select("svg").remove();
            mapControl.existMap = false;
            mapControl.mapName = mapName;
            mapControl.confmapPlot(myData,mapName,config, false, function() {});
            mapControl.existMap = true;
        }
        d3.select("#menu-plot-conf").style("display",""); //menu to display map 
        d3.select("#menu-conf").style("display","none");   //menu to choose a new localisation                    
    }
    preparePlot();
    
    /** function getName :arrange data in the form like [{ value: 'string', data: any }, ... ]
    * ex : ["CN=Laurence EYRAUD-JOLY,OU=Klee SA,OU=Utilisateurs,DC=KLEE,DC=LAN,DC=NET",{ "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }]
    * @param {*} element 
    * @param {*} index 
    * @param {*} array 
    */
    function getName(element, index, array){
        people.push({value: element.firstname + " " + element.lastname, data: element});
    }

    //Use to build search bar
    $.getJSON(server+'getInfoPerson', function(data) {//data is the JSON file
        data.forEach(getName);

        // setup autocomplete function pulling from people[] array
        $('#search-one-term')
        .autocomplete({
            lookup: people,
            onSelect: function (suggestion) {
                // suggestion.data example: { "mail": ["Laurence.EYRAUDJOLY@kleegroup.com"], "physicalDeliveryOfficeName": ["La Boursidière : N4-D-01"], "cn": ["Laurence EYRAUD-JOLY"] }
                var table,
                    mapName,
                    site,
                    desk;
                var isAlreadyUsed=false;
                var firstname=suggestion.data.firstname,
                    lastname=suggestion.data.lastname;

                for (var k=0;k<newConfig.length;k++){
                    if (newConfig[k][0]==firstname && newConfig[k][1]==lastname){
                        isAlreadyUsed=true;
                    }
                }

                d3.select("#menu-plot-conf").style("display","none");
                d3.select("#menu-conf").style("display","");
                                
                if (suggestion.data.deskname){
                    // find information on the researched person
                    desk=suggestion.data.deskname;
                    site=suggestion.data.site;
                    var location=site+' : '+desk;
                    if (desk!="aucun" && desk!="externe"){
                        mapName=desk.substring(0,2);
                    }else{
                        mapName="N0"
                    }

                    //plot his map and his position               
                    if (mapName!="None"){
                        d3.selectAll(".site-conf").style("font-weight","normal");
                        d3.selectAll("#etages_conf").style("font-weight","normal");
                        d3.select("#"+mapName+"_conf").style("font-weight","bold");
                        // if no map showing on, plot the map with name "mapName", add pin to searched person's table
                        if(!mapControl.existMap) {
                            mapControl.mapName = mapName;
                            mapControl.confmapPlot(myData,mapName, configId, true, function() {
                                if (desk!="aucun" && desk!="externe"){
                                table = d3.select("#tables")
                                        .select("#" + desk);
                                
                                    table.append("image")
                                        .attr("xlink:href", "./img/pin_final.png")
                                        .attr("width", "30")
                                        .attr("height", "50")
                                        .attr("x", table.select("rect").attr("x") - 10)
                                        .attr("y", table.select("rect").attr("y") - 40);
                                }
                                if (view_access==true && isAlreadyUsed==false){
                                    validateDesk(suggestion.value)
                                }
                            });
                            mapControl.existMap = true;
                        }
                        // if a map exists, erase it and replot one 
                        else {
                            d3.select(".map").select("svg").remove();
                            mapControl.existMap = false;
                            mapControl.mapName = mapName;
                            mapControl.confmapPlot(myData,mapName,configId, true, function() {
                                if (desk!="aucun" && desk!="externe"){
                                table = d3.select("#tables")
                                        .select("#" + desk);
                                    table.append("image")
                                        .attr("xlink:href", "./img/pin_final.png")
                                        .attr("width", "30")
                                        .attr("height", "50")
                                        .attr("x", table.select("rect").attr("x") - 10)
                                        .attr("y", table.select("rect").attr("y") - 40);
                                } 
                                if (view_access==true && isAlreadyUsed==false){
                                    validateDesk(suggestion.value)
                                }
                            });
                            mapControl.existMap = true;
                        }
                    }

                    //activate the possibility to change localisation if view_access == true
                    if (view_access==true && isAlreadyUsed==false){
                        d3.select("#text-conf").html(suggestion.value+' est localisé '+location+'</br>Sélectionnez son nouvel emplacement')
                        //event when clicking on a site
                        d3.selectAll(".site-conf").on("click",function() {
                            var name=suggestion.value;
                            var mysite=d3.event.target.id.split(/_/)[0];
                            if (mysite=="boursidiere"){return;} //nothing happened
                            else{
                                for (var i=0;i<sitesExterne.length;i++){
                                    if (sitesExterne[i].search(mysite)!=-1){
                                        newsite=sitesExterne[i];
                                    }
                                }
                                //change must be confirmed
                                validateSite(name,newsite);
                            }
                        });
                        //event when clicking on a stair
                        d3.selectAll("#etages_conf").on("click",function() {
                            var name=suggestion.value;
                            var etage = document.querySelector(d3.event.target.id);
                            var myMap=d3.event.target.id.split(/_/)[0];

		                    if (!mapControl.existMap) {
			                    mapControl.mapName = myMap;
			                    mapControl.confmapPlot(myData,mapControl.mapName,configId, true, function() {validateDesk(name)});
			                    mapControl.existMap = true;
		                    }
		                    // if other map, delete and show myMap
		                    else if (mapControl.mapName !== myMap) {
			                    d3.select(".map").select("svg").remove();
			                    mapControl.mapName = myMap;
			                    mapControl.confmapPlot(myData,mapControl.mapName,configId,true, function() {validateDesk(name)});
		                    }
                        }); 
                    }else if(view_access==false){
                        //no right to change localization
                        d3.select("#text-conf").html(suggestion.value+' est localisé '+location)
                    }else if(view_access==true && isAlreadyUsed==true){
                        //already used in another moveline
                        d3.select("#text-conf").html(suggestion.value+' est déjà dans la liste des déplacements')
                    }
                }
 
            }
        });
    });

    //event when click on 'annuler' button - remove unsaved rows in table #table-to-fill and go to the page configurations
    $("#can-conf").click(function(event){
         window.location.href = server+"configurations";
    });

    //event when click on 'enregistrer button' to create the new movelines for each unsaved row in table #table-to-fill
    $('#val-conf').click(function(event){
        for (var i=0;i<newConfig.length;i++){
            if (newConfig[i][4]=="new-row"){
                newConfig[i][4]="former-row"
                var data={confid:configId,firstname:newConfig[i][0],lastname:newConfig[i][1],fromdesk:newConfig[i][2],todesk:newConfig[i][3],ind:i};
                $.ajax({
                    url: "addMoveLine",
                    type: 'POST',
                    data: data,
                    success : function(res){}
                });
            }
        }
        d3.select("#recap-conf").selectAll(".new-row").attr("class","former-row");
        //request post to update the dateUpdate column of MoveSet
        $.ajax({
            url: "updateDateMoveSet/"+configId,
            type: 'POST',
            complete : function(res,stat){
                console.log('update dateUpdate moveset')
            }
        });
        event.stopPropagation();

    })

    //event when click on the cross to delete a moveline
    $(document).on('click', '.delete-moveline', function(event){
        var firstname=event.target.parentNode.childNodes[1].innerText,
            lastname=event.target.parentNode.childNodes[0].innerText,
            fromDesk=event.target.parentNode.childNodes[2].innerText,
            toDesk=event.target.parentNode.childNodes[3].innerText;
        function detectToDelete(fromDesk,toDesk){
            var res=[];
            for (var i=0;i<newConfig.length;i++){  
                console.log(newConfig[i])              
                if (newConfig[i][0]==firstname && newConfig[i][1]==lastname){
                    console.log('same')
                    res.push({confId:configId,firstname:newConfig[i][0],lastname:newConfig[i][1],state:newConfig[i][4]});
                    newConfig.splice(i,1);
                    i-=1;
                }
                //I f I have been ejected by someone else, deleting my move must delete his too
                else if ((toDesk=="La Boursidière : aucun" && newConfig[i][3]==fromDesk)||(newConfig[i][3]=="La Boursidière : aucun" && newConfig[i][2]==toDesk)){
                    console.log('binome')
                    res.push({confId:configId,firstname:newConfig[i][0],lastname:newConfig[i][1],state:newConfig[i][4]});
                    newConfig.splice(i,1);
                    i-=1;
                }
            }
            return res
        }

        var list_to_delete=detectToDelete(fromDesk,toDesk);
        for (var i=0;i<list_to_delete.length;i++){
            console.log(list_to_delete[i])
            if (list_to_delete[i].state=="former-row"){
                d3.json(server +"deleteMoveline", function(){})
                .header("Content-Type","application/json")
                .send("POST", JSON.stringify(list_to_delete[i])); 
            }
        }

        $('#table-to-fill > tbody').empty();

        for (var j=0;j<newConfig.length;j++){
            var text='';
            if (view_access==true){
                    text="<tr class='"+newConfig[j][4]+"' id='"+newConfig[j][1]+newConfig[j][0]+"'><td>"+newConfig[j][1]+"</td><td>"+newConfig[j][0]+"</td><td>"+newConfig[j][2]+"</td><td>"+newConfig[j][3]+"</td><td class=delete-moveline></td></tr>"
            }else{
                    text="<tr class='"+newConfig[j][4]+"'  id='"+newConfig[j][1]+newConfig[j][0]+"><td>"+newConfig[j][1]+"</td><td>"+newConfig[j][0]+"</td><td>"+newConfig[j][2]+"</td><td>"+newConfig[j][3]+"</td></tr>"
            }
            $(text).appendTo("#table-to-fill")
            $("#nb-people-new-conf").html(newConfig.length) 
        }
        
        
    
    })


    /** function validateDesk : what to display when clicking on a desk on the current map */
    function validateDesk(name){
	    var allTables = d3.select("#tables").selectAll("g")
        allTables.style("cursor", "pointer")

        allTables.on("click", function(){
			var newDesk = d3.event.target.parentNode.id;
            var newsite="La Boursidière";
            // get the current person on the desk that I have clicked on
            d3.json(server + "getPersonByDesk/"+newDesk, function(isDeskAvailable){
                    //the desk on which I have clicked is empty
                    if (isDeskAvailable.length===0){
                        d3.select("#text-conf").html("Vous souhaitez déplacer "+name+" au bureau "+newDesk
                            +"<br/>Voules-vous ajouter ce déplacement à la configuration ?"+
                            "<button id=\"val-conf-move\" >Valider</button>"+
                            "<button id=\"can-conf-move\"><a href='"+server+"modify"+configId+"'>Annuler</a></button>");
                        document.getElementById("val-conf-move").onclick = function() {validateMove(name,newsite,newDesk)};
                    }
                    //the desk on which I have clicked is occupied
                    else{
                         d3.select("#text-conf").html("ATTENTION vous avez choisi le bureau "+newDesk
                            +" qui déjà occupé par "+isDeskAvailable[0].firstname+" "+isDeskAvailable[0].lastname
                            +"<br/>Voulez-vous déplacer "+name+" à ce bureau ?"+
                            "<button id=\"val-conf-move\" >Valider</button>"+
                            "<button id=\"can-conf-move\"><a href='"+server+"modify"+configId+"'>Annuler</a></button>");
                        document.getElementById("val-conf-move").onclick = function() {validateMove(name,newsite,newDesk)};
                    }
            });
		});
        //document.getElementById("can-conf-move").addEventListener("click", function() {event.stopPropagation()})
        return
    }

    /** function validateSite : what to display when clicking on a site on the menu */
    function validateSite(name,newsite){ 
        d3.select("#text-conf").html("Vous souhaitez déplacer "+name+" sur le site "+newsite
                            +"<br/>Voules-vous ajouter ce déplacement à la configuration ?</br>"+
                            "<button id=\"val-conf-move\" >Valider</button>"+
                            "<button id=\"can-conf-move\"><a href='"+server+"modify"+configId+"'>Annuler</a></button>");
        document.getElementById("val-conf-move").onclick = function() {validateMove(name,newsite,"externe")};
    }

    /**function validateMove : add my move to the table and create a moveline */
    function validateMove(name,site,desk){
        var firstname=getnames(name)[0];
        var lastname=getnames(name)[1];
        console.log(name+'/'+site+'/'+desk)
        d3.json(server + "currentOfficeName/"+firstname+'/'+lastname, function(formerDesk){
            var formerLocation=formerDesk[0].site+' : '+formerDesk[0].name;
            newConfig.push([firstname,lastname,formerLocation,site+' : '+desk,"new-row"])
            $("<tr class=\"new-row\" id=\""+newConfig[newConfig.length-1][1]+newConfig[newConfig.length-1][0]+"\"><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td>"+newConfig[newConfig.length-1][3]+"</td><td class=delete-moveline></td></tr>").appendTo("#table-to-fill")
            $("#nb-people-new-conf").html(newConfig.length)
        });
        if (desk!=="externe" && desk!=="aucun"){
            d3.json(server + "getPersonByDesk/"+desk, function(isDeskAvailable){
                if (isDeskAvailable.length!==0){
                    
                    newConfig.push([isDeskAvailable[0].firstname,isDeskAvailable[0].lastname,"La Boursidière : "+desk,"La Boursidière : aucun","new-row"])
                    $("<tr class=\"new-row\" id=\""+newConfig[newConfig.length-1][1]+newConfig[newConfig.length-1][0]+"\"><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td>"+newConfig[newConfig.length-1][3]+"</td><td class=delete-moveline></td></tr>").appendTo("#table-to-fill")   
                    $("#nb-people-new-conf").html(newConfig.length)
                }
            });
        }
        $("#text-conf").html("Veuillez rechercher la personne à déplacer")
    }

}(window));