
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
    var movelinesInvalid=[[],[]];

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
     *  Only configurations which can be modified have a the button delete-row
     */
    function plotTable(){
        $('#table-to-fill > tbody').empty();
        newConfig=[];
        d3.json(server + "getRecapOfMovings/"+configId, function(movelines){
            for (var i=0;i<movelines.length;i++){
                var text='';
                newConfig.push([movelines[i].firstname,movelines[i].lastname,movelines[i].depart,movelines[i].arrivee,"former-row"])
                if (view_access==true){
                    if (movelines[i].status=="Brouillon invalide"){
                        text="<tr class=\"invalid-row\" id='"+newConfig[newConfig.length-1][1]+newConfig[newConfig.length-1][0]+"'><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td title='Modifier'>"+newConfig[newConfig.length-1][3]+"</td><td class=delete-row></td></tr>"
                    }else{
                    text="<tr class=\"former-row\" id='"+newConfig[newConfig.length-1][1]+newConfig[newConfig.length-1][0]+"'><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td title='Modifier'>"+newConfig[newConfig.length-1][3]+"</td><td class=delete-row></td></tr>"
                    }
                }else{
                    text="<tr class=\"former-row\" id='"+newConfig[newConfig.length-1][1]+newConfig[newConfig.length-1][0]+"'><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td title='Modifier'>"+newConfig[newConfig.length-1][3]+"</td></tr>"
                }
                $(text).appendTo("#table-to-fill")
            }
            $("#nb-people-new-conf").html(newConfig.length) 
        });
    }

    function checkMovelines(callback){
        d3.json(server+'checkFromDeskMoveLine/'+configId,function(res){
            if (res.length>0){;
                d3.select("#recap-conf h3 img").style('visibility','visible')
            }
            for (var i=0;i<res.length;i++){
                //change status moveline to invalid
                $.ajax({
                    url: "setInvalidMoveline/"+res[i].mov_id,
                    type: 'POST',
                    success : function(res){}
                });
                movelinesInvalid[0].push({name:res[i].name,desk:res[i].fromdesk})
            }           
        
            d3.json(server+'checkToDeskMoveLine/'+configId,function(res){
                if (res.length>0){;
                    d3.select("#recap-conf h3 img").style('visibility','visible')
                }
                for (var i=0;i<res.length;i++){
                    //change status moveline to invalid
                    $.ajax({
                        url: "setInvalidMoveline/"+res[i].mov_id,
                        type: 'POST',
                        success : function(res){console.log('update')}
                    });
                    movelinesInvalid[1].push({name:res[i].name,todesk:res[i].todesk})
                }
                callback();  
            })
        })
        
    }

/** function preparePlot() : plot table ans buttons according to view_access and the map  */
    function preparePlot() {
        d3.select('#popin-error').style('display','none')
        d3.json(server + "getConfById/"+configId, function(dataset){
            $("#conf-status").html(dataset[0].state)
            if (dataset[0].state=="Brouillon"){
                view_access=true;
                d3.select("#recap-conf").selectAll('button').style('visibility','visible')
                $("#text-conf").html("Veuillez rechercher la personne à déplacer")
                checkMovelines(function(){
                    plotTable();
                })
                //To be able to change 'bureau cible'
                $(document).on('click', '#table-to-fill td:nth-child(4)', function(event){
                    console.log(event.target.parentNode.className)
                    if (event.target.parentNode.className!="invalid-row"){
                        var name=event.target.parentNode.childNodes[1].innerHTML+' '+event.target.parentNode.childNodes[0].innerHTML
                        var fromDesk=event.target.parentNode.childNodes[2].innerHTML
                        changeLocalization(name,fromDesk,false)
                    }
                });
            }else{
                view_acces=false;
                d3.select("#recap-conf").selectAll('button').style('visibility','hidden')
                $("#text-conf").html("Cette configuration n'est pas modifiable")
                $('#table-to-fill th:nth-child(5)').hide();
                plotTable();
            }

        })
        //display a map (mine by default or N0 if none)
        var mapName;
        if (myData[2].split(/-/).length==3){
            myData[2].split(/-/)[1]
        }else{mapName='N0'}

        reloadMap(mapName);

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
                            mapControl.confmapPlot(myData,mapName, configId, true,newConfig, function() {
                                if (desk!="aucun" && desk!="externe"){
                                table = d3.select("#tables")
                                        .select("#" + desk);
                                    if (table[0][0]!=null){
                                    table.append("image")
                                        .attr("xlink:href", "./img/pin_final.png")
                                        .attr("width", "30")
                                        .attr("height", "50")
                                        .attr("x", table.select("rect").attr("x") - 10)
                                        .attr("y", table.select("rect").attr("y") - 40);
                                    }
                                }
                                changeLocalization(suggestion.value,location,isAlreadyUsed)//name, localisation
                            });
                            mapControl.existMap = true;
                        }
                        // if a map exists, erase it and replot one 
                        else {
                            d3.select(".map").select("svg").remove();
                            mapControl.existMap = false;
                            mapControl.mapName = mapName;
                            mapControl.confmapPlot(myData,mapName,configId, true, newConfig, function() {
                                if (desk!="aucun" && desk!="externe"){
                                    table = d3.select("#tables")
                                        .select("#" + desk);
                                    if (table[0][0] !=null){
                                        table.append("image")
                                        .attr("xlink:href", "./img/pin_final.png")
                                        .attr("width", "30")
                                        .attr("height", "50")
                                        .attr("x", table.select("rect").attr("x") - 10)
                                        .attr("y", table.select("rect").attr("y") - 40);
                                    }
                                } 
                                changeLocalization(suggestion.value,location,isAlreadyUsed)//name, localisation
                            });
                            mapControl.existMap = true;
                        }
                    }

                    //activate the possibility to change localisation according to rights
                    

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
        function updateDataBase(callback){
            for (var i=0;i<newConfig.length;i++){
                if (newConfig[i][4]=="new-row"){
                    newConfig[i][4]="former-row"
                    var data={confid:configId,firstname:newConfig[i][0],lastname:newConfig[i][1],fromdesk:newConfig[i][2],todesk:newConfig[i][3],status:newConfig[i][5]};
                    //check if a moveline already exists for that person
                    $.ajax({
                            url: "deleteMoveLineIfFind",
                            type: 'POST',
                            data: data,
                            success : function(res){console.log('del former')}
                    });    
                    $.ajax({
                            url: "addMoveLine",
                            type: 'POST',
                            data: data,
                            success : function(res){console.log('add new')}
                    });                        
                }
            }
            d3.select("#recap-conf").selectAll(".new-row").attr("class","former-row");
            //request post to update the dateUpdate column of MoveSet
            $.ajax({
                url: "updateDateMoveSet/"+configId,
                type: 'POST',
                complete : function(res,stat){console.log('update dateUpdate moveset')}
            });
            event.stopPropagation();
            callback();
        }
        updateDataBase(function(){
            reloadMap('');
            $("#nb-people-new-conf").html(newConfig.length)
        })
    })

    //event when click on the cross to  a moveline
    $(document).on('click', '.delete-row', function(event){
        console.log(newConfig)
        var firstname=event.target.parentNode.childNodes[1].innerText,
            lastname=event.target.parentNode.childNodes[0].innerText,
            fromDesk=event.target.parentNode.childNodes[2].innerText,
            toDesk=event.target.parentNode.childNodes[3].innerText;
        // if people are linked : one has the desk of the other. delete one will delete the other
        function findPeopleToDelete(fromDesk,toDesk,callback){
            var res=[];
            for (var i=0;i<newConfig.length;i++){   
                //find my self           
                if (newConfig[i][0]==firstname && newConfig[i][1]==lastname){
                    console.log('me')
                    res.push({confId:configId,firstname:newConfig[i][0],lastname:newConfig[i][1],state:newConfig[i][4],ind :i,fromDesk:newConfig[i][2],toDesk:newConfig[i][3]});
                }
                //If I have been ejected by someone else, his move must be delete too so I can get my place back
                if ((fromDesk.split(/\s*:\s*/)[1]!="aucun" && fromDesk.split(/\s*:\s*/)[1]!="externe") && !(newConfig[i][0]==firstname && newConfig[i][1]==lastname)
                     && fromDesk==newConfig[i][3] ){
                         console.log('from' +newConfig[i][0])
                    findLinkedPerson(res,newConfig[i][2],newConfig[i][3])
                    res.push({confId:configId,firstname:newConfig[i][0],lastname:newConfig[i][1],state:newConfig[i][4], ind:i,fromDesk:newConfig[i][2],toDesk:newConfig[i][3]});
                }
                 //If I have ejected someone, his move must be delete if he has no place
                if ((toDesk.split(/\s*:\s*/)[1]!="aucun" && toDesk.split(/\s*:\s*/)[1]!="externe") && !(newConfig[i][0]==firstname && newConfig[i][1]==lastname)
                    && newConfig[i][3]=="La Boursidière : aucun" && toDesk==newConfig[i][2]){
                        console.log('to')
                        res.push({confId:configId,firstname:newConfig[i][0],lastname:newConfig[i][1],state:newConfig[i][4],ind :i,fromDesk:newConfig[i][2],toDesk:newConfig[i][3]});
                }
            } 
            function findLinkedPerson(res,fromDesk,toDesk){
                for (var i=0;i<newConfig.length;i++){   
                    //If I have been ejected by someone else, his move must be delete too so I can get my place back
                    if ((fromDesk.split(/\s*:\s*/)[1]!="aucun"  && fromDesk.split(/\s*:\s*/)[1]!="externe") && !(newConfig[i][0]==firstname && newConfig[i][1]==lastname)
                     && fromDesk==newConfig[i][3] ){
                         console.log(newConfig[i][0])
                        findLinkedPerson(res,newConfig[i][2],newConfig[i][3])
                        res.push({confId:configId,firstname:newConfig[i][0],lastname:newConfig[i][1],state:newConfig[i][4],ind :i,fromDesk:newConfig[i][2],toDesk:newConfig[i][3]});
                    }
                }
            }
            callback(res);
        }

        findPeopleToDelete(fromDesk,toDesk,function(list_to_delete){
            //display message to validate 
            $('<div id="popin-error"></div>').insertAfter('#table-conf')
            d3.select('#popin-error').style('display','');
            $("#popin-error").append('<div id="conf-deletion">'+
                                    '<h3> </h3>'+
                                    '<table><thead><tr><th>Nom</th><th>Prénom</th><th>Bureau actuel</th><th>Bureau cible</th></tr></thead></table></div>'+
                                    '<div>'+
                                        '<button id="val-del">Valider</button>'+
                                        '<button id="close-conf" >Fermer</button>'+
                                    '</div></div>')
            if (list_to_delete.length>1){
                $('#popin-error #conf-deletion h3').html('Confirmez vous la suppression des déplacements suivants ?')
                $('<p>NOTE: La suppression du déplacement de '+firstname+' '+lastname+' entrainera la suppression de tous les déplacements qui en dépendent car les bureaux sont ici attribués en cascade.</p>').appendTo($('#conf-deletion'))
            }
            else {
                $('#popin-error #conf-deletion h3').html('Confirmez vous la suppression du déplacement suivant ?')
            }
            for (var i=0;i<list_to_delete.length;i++){
                $('<tr><td>'+list_to_delete[i].lastname+'<td>'+list_to_delete[i].firstname+'</td><td>'+list_to_delete[i].fromDesk+'</td><td>'+list_to_delete[i].toDesk+'</tr>').appendTo('#popin-error #conf-deletion table')
            }
            
            $('#val-del').click(function(event){
                //remove people in the global var newConfig
                console.log(list_to_delete)
                for (var j=0;j<list_to_delete.length;j++){
                    for (var i=0;i<newConfig.length;i++){
                        if (newConfig[i][0]==list_to_delete[j].firstname && newConfig[i][1]==list_to_delete[j].lastname){
                            console.log('remove'+newConfig[i][0])
                            newConfig.splice(i,1)
                        }
                    }   
                }
                $("#nb-people-new-conf").html(newConfig.length)
                //reload the current map (without d people)          
                

                //check if there are still errors, if not remove error message
                var existErrors=false;
                for (var j=0;j<newConfig.length;j++){
                    if (newConfig[j][4]=="invalid-row"){
                        existErrors=true;
                    }
                }
                if (existErrors==false){
                    d3.select('#display-error').style('visibility','hidden')
                }
        
                // remove the movelines and the row of the plotted table
                for (var i=0;i<list_to_delete.length;i++){
                    $('#'+list_to_delete[i].lastname+list_to_delete[i].firstname).remove();
                    if (list_to_delete[i].state=="former-row" || list_to_delete[i].state=="invalid-row"){
                        d3.json(server +"deleteMoveline", function(){})
                            .header("Content-Type","application/json")
                            .send("POST", JSON.stringify(list_to_delete[i])); 
                    }
                }
                d3.select('#popin-error').remove()
                reloadMap('');
            })
            $('#close-conf').click(function(){
                d3.select('#popin-error').remove()
            })
        })
    })

    function changeLocalization(name,currentDesk,isAlreadyUsed){
        if (view_access==true && isAlreadyUsed==false){
            validateDesk(name);
            d3.select("#text-conf").html(name+' est localisé '+currentDesk+'</br>Sélectionnez son nouvel emplacement')
            //event when clicking on a site
            d3.selectAll(".site-conf").on("click",function() {
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
                var etage = document.querySelector(d3.event.target.id);
                var myMap=d3.event.target.id.split(/_/)[0];

		        if (!mapControl.existMap) {
			        mapControl.mapName = myMap;
			        mapControl.confmapPlot(myData,mapControl.mapName,configId, true, newConfig,function() {validateDesk(name)});
			        mapControl.existMap = true;
		        }
		        // if other map,  and show myMap
		        else if (mapControl.mapName !== myMap) {
			        d3.select(".map").select("svg").remove();
			        mapControl.mapName = myMap;
			        mapControl.confmapPlot(myData,mapControl.mapName,configId,true,newConfig,  function() {validateDesk(name)});
		            }
            }); 

        }else if(view_access==false){
            //no right to change localization
            d3.select("#text-conf").html(name+' est localisé '+currentDesk)
        }else if(view_access==true && isAlreadyUsed==true){
            //already used in another moveline
            d3.select("#text-conf").html(name+' est déjà dans la liste des déplacements')
        }

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
                            "<button id=\"can-conf-move\">Annuler</button>");
                        document.getElementById("val-conf-move").onclick = function() {validateMove(name,newsite,newDesk)};
                        document.getElementById("can-conf-move").onclick = function() {cancelMove()};
                    }
                    //the desk on which I have clicked is occupied
                    else{
                         d3.select("#text-conf").html("ATTENTION vous avez choisi le bureau "+newDesk
                            +" qui déjà occupé par "+isDeskAvailable[0].firstname+" "+isDeskAvailable[0].lastname
                            +"<br/>Voulez-vous déplacer "+name+" à ce bureau ?"+
                            "<button id=\"val-conf-move\" >Valider</button>"+
                            "<button id=\"can-conf-move\">Annuler</button>");
                        document.getElementById("val-conf-move").onclick = function() {validateMove(name,newsite,newDesk)};
                        document.getElementById("can-conf-move").onclick = function() {cancelMove()};
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
                            "<button id=\"can-conf-move\">Annuler</button>");
            document.getElementById("val-conf-move").onclick = function() {validateMove(name,newsite,"externe")};
            document.getElementById("can-conf-move").onclick = function() {cancelMove()};
        }

        /**function validateMove : add my move to the table and create a moveline */
        function validateMove(name,site,desk){
            var firstname=getnames(name)[0];
            var lastname=getnames(name)[1];
            d3.json(server + "currentOfficeName/"+firstname+'/'+lastname, function(formerDesk){
                var formerLocation=formerDesk[0].site+' : '+formerDesk[0].name;
                var ind=null;
                for (var i=0;i<newConfig.length;i++){
                    if (newConfig[i][0]==firstname && newConfig[i][1]==lastname){
                        ind=i;
                    }
                }
                if (ind==null){
                    newConfig.push([firstname,lastname,formerLocation,site+' : '+desk,"new-row","déplacement brouillon"])
                    $("<tr class=\"new-row\" id=\""+newConfig[newConfig.length-1][1]+newConfig[newConfig.length-1][0]+"\"><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td title='Modifier'>"+newConfig[newConfig.length-1][3]+"</td><td class='delete-row'></td></tr>").appendTo("#table-to-fill")
                    $("#nb-people-new-conf").html(newConfig.length)
                }else{
                    newConfig.splice(ind,1)
                    newConfig.push([firstname,lastname,formerLocation,site+' : '+desk,"new-row","déplacement brouillon"])
                    $("#"+lastname+firstname+" td:nth-child(4)").html(newConfig[ind][3])
                    d3.select("#"+lastname+firstname).attr('class','new-row')
                }

            });
            if (desk!=="externe" && desk!=="aucun"){
                d3.json(server + "getPersonByDesk/"+desk, function(isDeskAvailable){
                    if (isDeskAvailable.length!==0){
                        newConfig.push([isDeskAvailable[0].firstname,isDeskAvailable[0].lastname,"La Boursidière : "+desk,"La Boursidière : aucun","new-row","éjection brouillon"])
                        $("<tr class=\"new-row\" id=\""+newConfig[newConfig.length-1][1]+newConfig[newConfig.length-1][0]+"\"><td>"+newConfig[newConfig.length-1][1]+"</td><td>"+newConfig[newConfig.length-1][0]+"</td><td>"+newConfig[newConfig.length-1][2]+"</td><td>"+newConfig[newConfig.length-1][3]+"</td><td class=delete-row></td></tr>").appendTo("#table-to-fill")   
                        $("#nb-people-new-conf").html(newConfig.length)
                    }
                });
            }
            $("#text-conf").html("Veuillez rechercher la personne à déplacer")
            reloadMap('')
        }
        function cancelMove(){
            d3.select('#text-conf').html('Veuillez rechercher la personne à déplacer')
            reloadMap('');
            d3.select('#search-one-term')[0][0].value=''
        }
    }

    $('#display-error').click(function(){
        $('<div id="popin-error"></div>').insertAfter('#table-conf')
        d3.select('#popin-error').style('display','');
        $("#popin-error").append('<div id="error-fromdesk"></div>'+
                                    '<div id="error-todesk"></div>'+
                                    '<div>'+
                                        '<button id="close-error" >Fermer</button>'+
                                    '</div>')
                                    console.log(movelinesInvalid)
        if (movelinesInvalid[0].length>0){
            
            $('<h3> Erreur sur les bureaux actuels</h3> Les personnes suivantes ont changé de bureau. Veuillez les supprimer et les saisir à nouveau</p><table><thead><tr><td>Nom Prénom</td><td>Bureau actuel</td></tr></thead></table>').appendTo('#popin-error #error-fromdesk')
            for (var i=0;i<movelinesInvalid[0].length;i++){
                $('<tr><td>'+movelinesInvalid[0][i].name+'<td>'+movelinesInvalid[0][i].desk+'</td></tr>').appendTo('#popin-error #error-fromdesk table')
            }
        }
        if (movelinesInvalid[1].length>0){
            $('<h3> Erreur sur les bureaux cibles</h3><p> Ces bureaux ont changé d\'occupants. Veuillez les supprimer et les saisir à nouveau</p><table><thead><tr><td>Nom Prénom</td><td>Bureau cible</td></tr></thead></table>').appendTo('#popin-error #error-todesk')
            for (var i=0;i<movelinesInvalid[1].length;i++){
                $('<tr><td>'+movelinesInvalid[1][i].name+'<td>'+movelinesInvalid[1][i].todesk+'</td></tr>').appendTo('#popin-error #error-todesk table')
            }
        }
        $('#close-error').click(function(){
            d3.select('#popin-error').remove()
        })
    })

    function reloadMap(mapName){
        if (mapName==''){
            var mapName=d3.select('#map-name h1').attr('class');
        }
            if (mapName){
                if(!mapControl.existMap) {
                    mapControl.mapName = mapName;
                    mapControl.confmapPlot(myData,mapName, configId, false, newConfig, function() {});
                    mapControl.existMap = true;
                }
                // if a map exists, erase it and replot one 
                else {
                    d3.select(".map").select("svg").remove();
                    mapControl.existMap = false;
                    mapControl.mapName = mapName;
                    mapControl.confmapPlot(myData,mapName,configId, false,newConfig, function() {});
                    mapControl.existMap = true;
                }
            }  
    }



}(window));