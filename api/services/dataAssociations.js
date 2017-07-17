/**
 * Created by msalvi on 05/09/2016.
 */

//files
const peopleFile = require('../data/KleeGroup.json');
//const statesFile = require('../../config/states.json');

// models
var models = require("../../models");
var Company = models.Company;
var BusinessUnit = models.BusinessUnit;
var Desk = models.Desk;
var Person = models.Person;
var MoveStatus = models.MoveStatus;
var MoveLine = models.MoveLine;
var Profil = models.Profil;

// libs
var _ = require('underscore');
var Promise = require("bluebird");

/**
* Make associations between objects
 */
const associate = (req, res) => {

// UPDATES have to be done after all the INSERTS
    peopleFile.forEach(function (data) {
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
        var mail="";
        if(d.mail !== null && d.mail !== undefined && d.mail !== "") {
            mail = d.mail.toString();
        } 
        // ex "La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"],, "KLEE Le Mans" => ["Le Mans","externe"]
                var desk="aucun";
                var site="aucun";
                if (d.physicalDeliveryOfficeName) {
                    var location=d.physicalDeliveryOfficeName[0];
                    if (location.split(/\s+:\s+/)[0]=="La Boursidière"){ 
                        site="La Boursidière";
                         //check desk is the correct form
                        if (location.split(/\s+:\s+/)[1].split(/-/).length==3){ // XX-X-XX
                            desk=location.split(/\s+:\s+/)[1];
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
        //  Table BsusinessUnit : <fk> Company
        if(dpt !== null && dpt !== undefined && dpt !== ""
        && company !== undefined && company !== null && company !== "") {
            models.sequelize.query('UPDATE \"BusinessUnit\" SET company_id = (' +
                'SELECT com_id FROM \"Company\" WHERE name = :cpname' +
                ') WHERE name = :buname ',
                {replacements: {cpname: company, buname: dpt}, type: models.sequelize.QueryTypes.UPDATE}
                
            ).then(function (poles) {
                    //console.log(poles)
                });
            //Table Person : <fk> BusinessUnit
            if (nameParts[0] !== undefined && nameParts[0] !== null && nameParts[0] !== ""
                && nameParts[1] !== undefined && nameParts[1] !== null && nameParts[1] !== ""){
                    if (dpt !== undefined && dpt !==null && dpt!==""){
                        models.sequelize.query('UPDATE \"Person\" SET '  +
                                '\"businessUnit_id\" = (SELECT bus_id FROM \"BusinessUnit\" WHERE name = :polename) ' +
                                ' WHERE firstname = :firstname and lastname = :lastname',
                                {replacements: {polename: dpt, firstname: nameParts[0], lastname: nameParts[1]},
                                type: models.sequelize.QueryTypes.UPDATE})
                    }
            }
        }
    });
    // Moveline : <fk> moveset
    models.sequelize.query('UPDATE "MoveLine" SET move_set_id= (SELECT set_id FROM "MoveSet" WHERE name= :set) WHERE status= :line;',
    {replacements:{set:"Configuration premiere",line:"initialisation"},type :models.sequelize.QueryTypes.UPDATE})


    // debug
    res.json(peopleFile);
};

module.exports = {
    associate
}


