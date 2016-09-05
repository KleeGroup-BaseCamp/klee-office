/**
 * Created by msalvi on 05/09/2016.
 */

//files
const peopleFile = require('../data/KleeGroup.json');
//const statesFile = require('../../config/states.json');

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
* Make associations between objects
 */
const associate = (req, res) => {

// UPDATES have to be done after all the INSERTS


    peopleFile.forEach(function (data) {
        var d = data[1];
        var company = d.company.toString();
        var dpt = d.department.toString();
        var peopleName = d.cn.toString();
        var nameParts = peopleName.split(" ");
        var mail = d.mail.toString();

        // ex "La Boursidiere : N3-A-01" => ["La Boursidiere", "N3-A-01"]
        if (d.physicalDeliveryOfficeName) {
            var splitID = d.physicalDeliveryOfficeName[0].split(/\s+:\s+/);
            if (splitID[1]) {
                var office = splitID[1];
            }
        }
        // Poles
        models.sequelize.query('UPDATE Poles set CompanyComId = (' +
            'select com_id from Companies where name = :cpname' +
            ')where name = :polename ',
            {replacements: {cpname: company, polename: dpt}, type: models.sequelize.QueryTypes.UPDATE}
        ).then(function (poles) {
                console.log(poles)
            });
        //People
        models.sequelize.query('UPDATE People set PolePolId = (' +
            'select pol_id from Poles where name = :polename' +
            ')where firstname = :firstname and lastname = :lastname',
            {
                replacements: {polename: dpt, firstname: nameParts[0], lastname: nameParts[1]},
                type: models.sequelize.QueryTypes.UPDATE
            }
        ).then(function (people) {
                console.log(people)
            });
        // Movings
        var confname = "Configuration premiere";
        if (office !== undefined && office !== null && office !== "") {
            models.sequelize.query('UPDATE Movings set ' +
                'newOfficeOffId = (select off_id from Offices where name = :offname ),' +
                'OfficeOffId = (select off_id from Offices where name = :offname ),' +
                'ConfigurationConId = (select con_id from Configurations where name = :confname )' +
                'where PersonPerId = (select per_id from People where firstname= :firstname and lastname= :lastname) ',
                {replacements: {offname: office, confname: confname, firstname: nameParts[0], lastname: nameParts[1]}, type: models.sequelize.QueryTypes.UPDATE}
            ).then(function (movings) {
                    console.log(movings)
                });
        }

    });
    // debug
    res.json(peopleFile);
};

module.exports = {
    associate
}


