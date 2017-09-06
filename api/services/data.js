/**
 * Created by msalvi on 02/09/2016.
 */

//files
const peopleFile = require('../data/KleeGroup.json');

// models
var models = require("../../models");
var Company = models.Company;
var BusinessUnit = models.BusinessUnit;
var Desk = models.Desk;
var Person = models.Person;
var Profil = models.Profil;
var MoveLine = models.MoveLine;
var Site=models.Site;
var MoveSet=models.MoveSet;
var MoveStatus=models.MoveStatus;

// libs
var _ = require('underscore');
var Promise = require("bluebird");

/**
 * Populate database from json data file
 * providing every 30 min
 * updated data from active directory
 */
const populate = (req, res) => {

    /**
     * for each data in the dataset
     * insert the corresponding data in the database
     */
    var area=['N0','N1','N2','N3','N4','O1','O2','O3','O4']
    var regex='^(';
    for (var i=0;i<area.length;i++){
        regex+=area[i]+'|'
    }
    regex=regex.substring(0,regex.length-1)+')-[A-Z]-[0-9][0-9]'
    var company_dep = [];
    var companies=[];
    var desks=[];
    var sites = ["La Boursidière","Issy-les-Moulineaux","Le Mans","Lyon","Bourgoin-Jailleux","Montpellier","sur site client"];
    // insert states and a new configuration "Validee"
    Promise.each(sites, function(elem, index, length){
        Site.build({name : elem})
            .save()
            .error(function (err) {
            console.log(err + " ---------" + elem);
            });
    });
    
    var states = ["Déplacement personnel", "Validee", "Brouillon"];
    // insert states and a new configuration "Validee"
    Promise.each(states, function(elem, index, length){
            var state = MoveStatus.build({name: elem});
            state.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                })
                .then(function(savedState){
                    console.log("states saved !");
                    if(elem == "Validee"){
                        var id = savedState.dataValues.sta_id;
                        //console.log(savedState.dataValues)
                        var today = new Date();
                        var technicaldate = new Date();
                        // insert current configuration
                        models.sequelize.query('INSERT into \"MoveSet\"(name, creator, \"dateCreation\", \"dateUpdate\",status_id) ' +
                            'VALUES (\'Configuration premiere\', \'System\', \:dateToday\, :date, :id)',
                            { replacements: { dateToday: today, date: technicaldate, id: id}, type: models.sequelize.QueryTypes.INSERT })
                    }
                })
    });

    var doInserts = new Promise(function(callback){

        peopleFile.forEach(function(data, index){
                var d = data[1];
                var comp;
                /*var ou=data[0].split(',')[1].split('=')[1];
                if(ou !== undefined && ou !== null && ou !== ""){
                    company = ou.toString();
                }*/
                // --------  Nouvelle définition de Company ----------- //
                if(d.company !== null && d.company !== undefined && d.company !== ""){
                    comp = d.company.toString();
                }
                // ---------------------------------------------------- //
                var dpt;
                if(d.department !== null && d.department !== undefined && d.department !== ""){
                    dpt = d.department.toString();
                }
                var peopleName = d.cn.toString();
                var nameParts = peopleName.split(" ");
                var lastname='';
                var firstname='';
                for (var i=0;i<nameParts.length;i++){
                    if (nameParts[i]==nameParts[i].toUpperCase()){
                        lastname+=nameParts[i]+" "
                    }else{firstname+=nameParts[i]+" "}
                }
                lastname = lastname.substring(0,lastname.length-1);
                firstname = firstname.substring(0,firstname.length-1)
                var mail="";
                if(d.mail !== null && d.mail !== undefined && d.mail !== "") {
                    mail = d.mail.toString();
                } 
                // ex location ="La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"]
                
                var desk="aucun";
                var site="La Boursidière";
                var desk_building=null;
                var desk_floor=null;
                /*if (d.physicalDeliveryOfficeName) {
                    var location=d.physicalDeliveryOfficeName[0];
                    if(location.search("issy")!=-1 || location.search("Issy")!=-1){
                        site="Issy-les-Moulineaux";
                        desk="externe";
                    }else if(location.search("mans")!=-1 || location.search("Mans")!=-1){
                        site="Le Mans";
                        desk="externe";
                    }else if(location.search("lyon")!=-1 || location.search("Lyon")!=-1){
                        site="Lyon";
                        desk="externe";
                    }else if(location.search("bourgoin")!=-1 || location.search("Bourgoin")!=-1){
                        site="Bourgoin-Jailleux";
                        desk="externe";
                    }else if(location.search("montpellier")!=-1 || location.search("Montpellier")!=-1){
                        site="Montpellier";
                        desk="externe";
                    }else if(location.search("client")!=-1 || location.search("Client")!=-1){
                        site="sur site client";
                        desk="externe";
                    }else{ 
                        site="La Boursidière";
                         //check desk is the correct form
                        if (location.split(/\s+:\s+/)[1].match(regex)!=null){ // XX-X-XX
                            desk=location.split(/\s+:\s+/)[1];
                            desks.push(desk);
                            var desk_building=desk[0];
                            var desk_floor=desk[1];
                        }else {desk="aucun"}
                    }
                }*/
                if (d.physicalDeliveryOfficeName) {
                    var location=d.physicalDeliveryOfficeName[0];
                    if (location.split(/\s+:\s+/)[0]=="La Boursidière"){ 
                        site="La Boursidière";
                         //check desk is the correct form
                        if (location.split(/\s+:\s+/)[1].split(/-/).length==3){ // XX-X-XX
                            desk=location.split(/\s+:\s+/)[1];
                            desks.push(desk);
                            var desk_building=desk[0];
                            var desk_floor=desk[1];
                        }else {desk="aucun"}
                    }else if(location.search("issy")!=-1 || location.search("Issy")!=-1){
                        site="Issy-les-Moulineaux";
                        desk="externe";
                    }else if(location.search("mans")!=-1 || location.search("Mans")!=-1){
                        site="Le Mans";
                        desk="externe";
                    }else if(location.search("lyon")!=-1 || location.search("Lyon")!=-1){
                        site="Lyon";
                        desk="externe";
                    }else if(location.search("bourgoin")!=-1 || location.search("Bourgoin")!=-1){
                        site="Bourgoin-Jailleux";
                        desk="externe";
                    }else if(location.search("montpellier")!=-1 || location.search("Montpellier")!=-1){
                        site="Montpellier";
                        desk="externe";
                    }else if(location.search("client")!=-1 || location.search("Client")!=-1){
                        site="sur site client";
                        desk="externe";
                    }
                }
                    
                if  (dpt == null || dpt == undefined || dpt == ""){
                        dpt="Non renseigne-"+comp
                } 
                if(companies.indexOf(comp) < 0 && comp !== null && comp !== undefined && comp !== ""){
                    companies.push(company)
                }
                if (company_dep.indexOf(comp) < 0){
                    company_dep.push(comp);
                    company_dep.push([dpt])
                }
                else{
                    var ind=company_dep.indexOf(comp)
                    if (company_dep[ind+1].indexOf(dpt) < 0){
                        company_dep[ind+1].push(dpt)
                    }
                }

                if (firstname !== undefined && firstname !== null && firstname !== ""
                && lastname !== undefined && lastname !== null && lastname !== ""){
                    var pers = Person.build({firstname: firstname, lastname: lastname, mail: mail,dateUpdate : Date.now()});
                    pers.save()
                        .error(function (err) {
                            console.log(err + " ---------" + elem);
                        }).then(function(newPerson){
                            //console.log(firstname + lastname);
                            var perId = newPerson.dataValues.per_id;
                            var date=new Date();
                            // create the desk and the initial moveline
                            models.sequelize.query('SELECT * FROM "Site" WHERE "Site".name = :sitename ',{ replacements: {sitename: site },type: models.sequelize.QueryTypes.SELECT})
                                .then(function(mysite){
                                    var sitId=null;
                                    if (mysite.length>0){sitId=mysite[0].sit_id};
                                    if (site=="La Boursidière"){ // condition to avoid having two instances of the same desk
                                        if (desks.indexOf(desk)!=-1){
                                            Desk.create({name:desk,dateUpdate:new Date(),building:desk_building,floor:desk_floor,person_id:perId, site_id: sitId})
                                            .then(function(newDesk){
                                                MoveLine.create({person_id: perId, fromDesk:null, toDesk:newDesk.des_id, dateCreation :date, status :"initialisation" })
                                            })
                                        }else{
                                            Desk.create({name:"aucun",dateUpdate:new Date(),building:desk_building,floor:desk_floor,person_id:perId, site_id: sitId})
                                            .then(function(newDesk){
                                                MoveLine.create({person_id: perId, fromDesk:null, toDesk:newDesk.des_id, dateCreation :date, status :"initialisation" })
                                            })
                                        }
                                    }
                                    else {
                                        Desk.create({name:desk,dateUpdate:new Date(),building:desk_building,floor:desk_floor,person_id:perId, site_id: sitId})
                                        .then(function(newDesk){
                                            MoveLine.create({person_id: perId, fromDesk:null, toDesk:newDesk.des_id, dateCreation :date, status :"initialisation"})
                                        })
                                    }
                                })
                            
                            //create the profil
                            Profil.build({isValidatorLvlOne:false,isValidatorLvlTwo:false })
                                .save()
                                .error(function (err) {
                                    console.log(err + " ---------" + elem);
                                })
                                .then(function(pro){
                                models.sequelize.query(
                                    'UPDATE \"Person\" SET profil_id= :proid ' +
                                    'WHERE \"Person\".per_id = :perid '
                                    , { replacements: { proid: pro.pro_id, perid: perId },
                                    type: models.sequelize.QueryTypes.UPDATE})
                                })
                        })
                }
                
        });
       
    });

    // do insert THEN updates
    doInserts.then(function(results){
        console.log("after all the inserts, do the inserts2.");
    });
    var doInserts2 = new Promise(function(callback){
    //console.log(companies);
    //console.log(company_dep[1])
    var company, ind
        for (var i=0;i<company_dep.length;i=i+2){
            company=company_dep[i]
            Company.create({name : company})
            .then(function(comp){
                ind=company_dep.indexOf(comp.name)+1;
                for (var j=0;j<company_dep[ind].length;j++){
                   BusinessUnit.create({name:company_dep[ind][j],company_id:comp.com_id})          
                }
            })
        } 
    })
    doInserts2.then(function(results){
        console.log("after all the inserts, do the updates.");
    });

    // debug
    res.json(peopleFile);

};

module.exports = {
    populate
}
