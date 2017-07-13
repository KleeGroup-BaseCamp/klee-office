/**
 * control the acces to configuration and administrators pages
 */
var server="http://localhost:3000/";

//Peronnal account
var myData=["Alain", "GOURLAY","",""];
d3.json(server + "currentOfficeName/" + myData[0] + "/" + myData[1], function(err, res){
        if (res.length>0){
            myData[2] = res[0].name;
            myData[3]= res[0].site;
        }else{myData[2] ="no-desk" };
        //to show information about my account on each page
        d3.select("#personal-firstname").html(myData[0]+"&nbsp");
        d3.select("#personal-lastname").html(myData[1]+" -- ");
        if (myData[3]==""||myData[3]==null||myData[3]==undefined){
            d3.select("#personal-site").html(" Site non défini --");
        }else{
        d3.select("#personal-site").html(myData[3]+" -- ");}
        if (myData[3]=="La Boursidière"){
            d3.select("#personal-desk").html(myData[2]);
        }else{d3.select("#personal-desk").html("Externe");}
});


/** FUNCTION
 *  to add a new administrator, please add the firstname and the lastname in the object "data" below
 */
/*var data={"firstname":"Alain","lastname":"GOURLAY"};
d3.json(server +"saveAdministrator", function(){
    }).header("Content-Type","application/json")
    .send("POST", JSON.stringify(data));
console.log(data.firstname+" "+data.lastname+" est un administrateur");*/

/** FUNCTION
 * to delete a new administrator, please add the firstname and the lastname in the object "data" below
 */
/*var data={"firstname":"Alain","lastname":"GOURLAY"};
d3.json(server +"deleteAdministrator", function(){
    }).header("Content-Type","application/json")
    .send("POST", JSON.stringify(data));
console.log(data.firstname+" "+data.lastname+" n'est plus un administrateur");*/

