/**
 * Created by msalvi on 02/09/2016.
 */

//files
const peopleFile = require('../data/KleeGroup.json');

// models
var models = require("../../models");
var Company = models.Company;
var Pole = models.Pole;
var Office = models.Office;
var Person = models.Person;
var State = models.State;
var Movings = models.Moving;

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
    var offices = [];

    var doInserts = new Promise(function(callback){

        peopleFile.forEach(function(data, index){
                var d = data[1];
                var company;
                if(d.company !== undefined && d.company !== null && d.company !== ""){
                    company = d.company.toString();
                }
                var dpt;
                if(d.department !== null && d.department !== undefined && d.department !== ""){
                    dpt = d.department.toString();
                }
                var peopleName = d.cn.toString();
                var nameParts = peopleName.split(" ");
                if(d.mail !== null && d.mail !== undefined && d.mail !== "") {
                    mail = d.mail.toString();
                } else {
                    mail = "";
                }
                // ex "La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"]
                if (d.physicalDeliveryOfficeName) {
                    var splitID = d.physicalDeliveryOfficeName[0].split(/\s+:\s+/);
                    if (splitID[1]) {
                        var office = splitID[1];
                    }
                }
                if(companies.indexOf(company) < 0 && company !== null && company !== undefined && company !== ""){
                    companies.push(company);
                }
                if(departments.indexOf(dpt) < 0 && dpt !== null && dpt !== undefined && dpt !== ""){
                    departments.push(dpt);
                }
                if(offices.indexOf(office) < 0 && office !== null && office !== undefined && office !== ""){
                    offices.push(office);
                }
                if (nameParts[0] !== undefined && nameParts[0] !== null && nameParts[0] !== ""
                && nameParts[1] !== undefined && nameParts[1] !== null && nameParts[1] !== ""){
                    var pers = Person.build({firstname: nameParts[0], lastname: nameParts[1], mail: mail});
                    pers.save()
                        .error(function (err) {
                            console.log(err + " ---------" + elem);
                        }).then(function(newPerson){
                            console.log(nameParts[0] + nameParts[1]);
                            var perId = newPerson.dataValues.per_id;
                            var mov = Movings.build({PersonPerId: perId});
                            mov.save()
                                .error(function (err) {
                                    console.log(err + " ---------" + elem);
                                }).then(function(){

                                });
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
            var dpt = Pole.build({name : elem});
            dpt.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                });
        });
        offices.forEach(function(elem, index){
            var off = Office.build({name : elem});
            off.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                });
        });

        var states = ["A valider", "Validee", "Brouillon"];

        // insert states and a new configuration "Validee"
        Promise.each(states, function(elem, index, length){
            var state = State.build({name: elem});
            state.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                })
                .then(function(savedState){
                    console.log("states saved !");
                    if(elem == "Validee"){
                        var id = savedState.dataValues.sta_id;
                        //console.log(savedState.dataValues)
                        var today = Date.now();
                        var validee = "Validee";
                        // insert current configuration
                        models.sequelize.query('INSERT into Configurations(\'name\', \'creator\', \'dateCreation\', \'StateStaId\', \'createdAt\', \'updatedAt\') ' +
                            'Values (\'Configuration premiere\', \'System\', \':date\', :id, :date, :date)',
                            { replacements: { date: today, validee: validee, id: id}, type: models.sequelize.QueryTypes.INSERT }
                        ).then(function(states) {
                                console.log(states)
                            });
                    }
                });
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
