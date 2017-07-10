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

    var companies = [];
    var departments = [];
    var desks = [];
    var sites = [];

    var doInserts = new Promise(function(callback){

        peopleFile.forEach(function(data, index){
                var d = data[1];
                var company;
                var ou=data[0].split(',')[1].split('=')[1];
                if(ou !== undefined && ou !== null && ou !== ""){
                    company = ou.toString();
                }
                var dpt;
                if(d.department !== null && d.department !== undefined && d.department !== ""){
                    dpt = d.department.toString();
                }
                var peopleName = d.cn.toString();
                var nameParts = peopleName.split(" ");
                var lastname = peopleName.substr(peopleName.indexOf(" ")+1);
                var mail="";
                if(d.mail !== null && d.mail !== undefined && d.mail !== "") {
                    mail = d.mail.toString();
                } 
                // ex "La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"]
                if (d.physicalDeliveryOfficeName) {
                    var splitID = d.physicalDeliveryOfficeName[0].split(/\s+:\s+/);
                    if (splitID[1]) {
                        var desk = splitID[1];
                        var building;
                        var floor=desk[1];
                        if (desk[0]=='N'){
                            building="Normandie";
                        }else if (desk[0]='O'){
                            building='Orléans';
                        }
                    }
                }
                if(companies.indexOf(company) < 0 && company !== null && company !== undefined && company !== ""){
                    companies.push(company);
                }
                if(departments.indexOf(dpt) < 0 && dpt !== null && dpt !== undefined && dpt !== ""){
                    departments.push(dpt);
                }
                if(sites.indexOf(site) < 0 && site !== null && site !== undefined && site !== ""){
                    sites.push(site);
                }
                if(desks.indexOf(desk) < 0 && desk !== null && desk !== undefined && desk !== ""){
                    desks.push([desk,building,floor]);
                }
                if (nameParts[0] !== undefined && nameParts[0] !== null && nameParts[0] !== ""
                && nameParts[1] !== undefined && nameParts[1] !== null && nameParts[1] !== ""){
                    var pers = Person.build({firstname: nameParts[0], lastname: lastname, mail: mail,dateUpdate : Date.now()});
                    pers.save()
                        .error(function (err) {
                            console.log(err + " ---------" + elem);
                        }).then(function(newPerson){
                            //console.log(nameParts[0] + nameParts[1]);
                            var perId = newPerson.dataValues.per_id;
                            var date=new Date();
                            var mov = MoveLine.build({person_id: perId,dateCreation :date, status :"initialisation" })
                                .save()
                                .error(function (err) {
                                    console.log(err + " ---------" + elem);
                                })

                            
                        });
                }
        });

        companies.forEach(function(elem, index){
            var comp = Company.build({name : elem});
            comp.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                });
        });
        departments.forEach(function(elem, index){
            var dpt = BusinessUnit.build({name : elem});
            dpt.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                });
        });

        var site = Site.build({name : "La Boursidière"});
            site.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                });


        desks.forEach(function(elem, index){
            var off = Desk.build({name : elem[0], building : elem[1], floor : elem[2]});
            off.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                });
        });

        // for non assigned former offices
        var offAucun = Desk.build({name : "aucun"});
        offAucun.save()
            .error(function (err) {
                console.log(err + " ---------" + elem);
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
    });

    // do insert THEN updates
    doInserts.then(function(results){
        console.log("after all the inserts, do the updates.");
    });

    // debug
    res.json(peopleFile);

};

module.exports = {
    populate
}
