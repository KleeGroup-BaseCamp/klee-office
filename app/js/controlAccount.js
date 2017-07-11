/**
 * control the acces to configuration and administrators pages
 */
var server="http://localhost:3000/";
var myData=["Alain GOURLAY","N4-C-01"];

//Peronnal account
//to show information about my account on each page
d3.select("#personal-name").html(myData[0]);
d3.select("#personal-desk").html(myData[1]);



/* TO add manually new validators
var data={"level":"Niveau 2","firstname":"Laurent","lastname":"BAROT"};
d3.json(server +"saveValidator", function(){
    }).header("Content-Type","application/json")
    .send("POST", JSON.stringify(data));

var data={"level":"Niveau 1","firstname":"Alain","lastname":"GOURLAY"};
d3.json(server +"saveValidator", function(){
    }).header("Content-Type","application/json")
    .send("POST", JSON.stringify(data));*/


/**
 *  to add a new administrator, please add the firstname and the lastname in the object "data" below
 */
/*var data={"firstname":"Alain","lastname":"GOURLAY"};
d3.json(server +"saveAdministrator", function(){
    }).header("Content-Type","application/json")
    .send("POST", JSON.stringify(data));
console.log(data.firstname+" "+data.lastname+" est un administrateur");*/

