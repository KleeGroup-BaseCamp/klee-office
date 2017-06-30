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
        // ex "La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"]
        var des;
        if (d.physicalDeliveryOfficeName) {
            var splitID = d.physicalDeliveryOfficeName[0].split(/\s+:\s+/);

            if (splitID[1]) {
                des = splitID[1];

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
                    console.log(poles)
                });
            //Table Person : <fk> BusinessUnit <fl> Profil
            if (nameParts[0] !== undefined && nameParts[0] !== null && nameParts[0] !== ""
                && nameParts[1] !== undefined && nameParts[1] !== null && nameParts[1] !== ""){
                models.sequelize.query('UPDATE \"Person\" SET \"businessUnit_id\" = (' +
                    'SELECT bus_id FROM \"BusinessUnit\" WHERE name = :polename' +
                    ') WHERE firstname = :firstname AND lastname = :lastname',
                    {replacements: {polename: dpt, firstname: nameParts[0], lastname: nameParts[1]},
                        type: models.sequelize.QueryTypes.UPDATE}
                ).then(function (people) {
                        console.log(people)
                    });
                /*models.sequelize.query('INSERT INTO \"Profil\"(\"isValidatorLvlOne\",\"isValidatorLvlTwo\") VALUES(false,false)',
                    {replacements:{},type :models.sequelize.QueryTypes.INSERT}
                    ).then(function(pro){})*/
                    const pro =Profil.build({isValidatorLvlOne : false, isValidatorLvlOne : false}).save().error(function (err) {console.log(err + " ---------" + elem)
                    .then(function(pro){
                        models.sequelize.query('UPDATE \"Person\" SET profil_id = :profil '  +
                            'WHERE firstname = :firstname and lastname = :lastname',
                            {replacements: {profil: pro.pro_id, firstname: nameParts[0], lastname: nameParts[1]},
                            type: models.sequelize.QueryTypes.UPDATE}).then(function(per){
                            //console.log(per);
                            })
                        })
                    })
            }
        }
        //Table Desk : <fk> person, <fk> site
        if (des!== null && des !== undefined && des !== ""){
            if (nameParts[0] !== undefined && nameParts[0] !== null && nameParts[0] !== ""
                && nameParts[1] !== undefined && nameParts[1] !== null && nameParts[1] !== ""){
                    models.sequelize.query('UPDATE \"Desk\" SET person_id ='+
                    '(SELECT per_id FROM \"Person\" WHERE firstname=:firstname AND lastname=:lastname)'+
                    'WHERE name = :deskname',
                {replacements:{firstname: nameParts[0], lastname: nameParts[1], deskname : des},
                type :models.sequelize.QueryTypes.UPDATE,logging:false}) 
            }
            if (des !== "aucun"){
                models.sequelize.query('UPDATE \"Desk\" SET site_id ='+
                    '(SELECT sit_id FROM \"Site\" WHERE name= :sitename) '+
                    'WHERE name = :deskname' ,
                {replacements:{sitename:"La Boursidière",deskname:des},type :models.sequelize.QueryTypes.UPDATE,logging:false})
            }
        }

        // Table MoveLine :<fk> MoveSet pour la Configuration première (Initialisation des emplacements)
        if (nameParts[0] !== undefined && nameParts[0] !== null && nameParts[0] !== ""
            && nameParts[1] !== undefined && nameParts[1] !== null && nameParts[1] !== ""){
            var confname = "Configuration premiere";
            if (des !== undefined && des !== null && des !== "") {
                models.sequelize.query('UPDATE \"MoveLine\" SET ' +
                    '\"toDesk\" = (SELECT des_id FROM \"Desk\" WHERE name= :desname ),' +
                    'move_set_id = (SELECT set_id FROM \"MoveSet\" where name = :confname )' +
                    'WHERE person_id = (SELECT per_id from \"Person\" WHERE firstname= :firstname and lastname= :lastname) ',
                    {replacements: {desname: des, confname: confname, firstname: nameParts[0], lastname: nameParts[1]}, type: models.sequelize.QueryTypes.UPDATE}
                ).then(function (movings) {
                        console.log(movings)
                    });
            }
        }

    });
    // debug
    res.json(peopleFile);
};

module.exports = {
    associate
}


