/**
 * control the acces to configuration and administrators pages
 */
var server="http://localhost:3000/";
var myData=["Alain", "GOURLAY",""];
d3.json(server + "currentOfficeName/" + myData[0] + "/" + myData[1], function(err, res){
        if (res.length>0){
            myData[2] = res[0].name;
        }else{myData[2] ="no-desk" };
        d3.select("#personal-firstname").html(myData[0]+/ /);
        d3.select("#personal-lastname").html(myData[1]+" -- ");
        d3.select("#personal-desk").html(myData[2]);
});
//Peronnal account
//to show information about my account on each page


/* TO add manually new validators
var data={"level":"2","firstname":"Laurent","lastname":"BAROT"};
d3.json(server +"saveValidator", function(){
    }).header("Content-Type","application/json")
    .send("POST", JSON.stringify(data));



/**
 *  to add a new administrator, please add the firstname and the lastname in the object "data" below
 */
/*var data={"firstname":"Alain","lastname":"GOURLAY"};
d3.json(server +"saveAdministrator", function(){
    }).header("Content-Type","application/json")
    .send("POST", JSON.stringify(data));
console.log(data.firstname+" "+data.lastname+" est un administrateur");*/

/*
var data={"firstname":"Alain","lastname":"GOURLAY"};
d3.json(server +"deleteAdministrator", function(){
    }).header("Content-Type","application/json")
    .send("POST", JSON.stringify(data));
console.log(data.firstname+" "+data.lastname+" n'est plus un administrateur");*/

