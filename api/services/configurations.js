/**
 * Created by msalvi on 09/09/2016.
 */

// models
var models = require('../../models');
var Company = models.Company;
var Pole = models.Pole;
var People = models.Person;
var Status = models.Status;
var Manager = models.Manager;
var Moving = models.Moving;
var Office = models.Office;
var Configuration = models.Configuration;
var State = models.State;

// libs
var fs = require("fs");

/**
 * List all configurations
 */
const getAllConf = (req, res) => {
    models.sequelize.query(
        'SELECT con.name as name, con.creator, con.dateCreation, sta.name as state, con.con_id ' +
        'from configurations as con ' +
        'join states sta on con.StateStaId = sta.sta_id', { replacements : {}, type: models.sequelize.QueryTypes.SELECT } ).then(function(conf){
            res.json(conf);
        });
}


/**
 * get number of movings for a configuration
 */
const getAllMovingsByConfIdCount = (req, res) => {
    /*Moving.findAndCountAll({
     where: {
     ConfigurationConId: req.params.id,
     $and: [{formerOfficeOffId: {$ne: null}}]
     }
     }).then(function(movings){
     res.json(movings)
     })*/
    models.sequelize.query(
        'SELECT count(*) as count ' +
        'from movings ' +
        'where movings.ConfigurationConId= :id ' +
        'and movings.formerOfficeOffId is not null ', { replacements : {id: req.params.id}, type: models.sequelize.QueryTypes.SELECT }
    ).then(function(conf){
            res.json(conf);
        }
    );
}

/**
 * get people and offices data
 * related to movings in a configuration
 */
const getPeopleMovingsByConId = (req, res) => {
    models.sequelize.query(
        'SELECT offices.name, people.firstname, people.lastname, people.mail ' +
        'from movings ' +
        'join people on people.per_id = movings.PersonPerId ' +
        'join offices on offices.off_id = movings.newOfficeOffId ' +
        'where movings.ConfigurationConId = :conid '
        //and movings.formerOfficeOffId is not null
        , { replacements: { conid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (people) {
            res.json(people);
        });
}

/**
 * delete a configuration and every related moving
 */
const deleteConfiguration = (req, res) => {
    Moving.destroy({
        where: {
            ConfigurationConId: req.params.id
        }
    }).then(function () {
        Configuration.destroy({
            where: {
                con_id: req.params.id
            }
        });
    }).then(function () {
        console.log("OK !");
        req.flash('success', 'La configuration a &eacutet&eacute supprim&eacutee.');
        res.json("success");
    });
}

/**
 * if consistent (checked before service call)
 */
const validateConfiguration = (req, res) => {
    console.log(req.body);

    // change status from current validated conf to draft
    models.sequelize.query(
        'UPDATE configurations ' +
        'SET StateStaId = (select sta_id from states where name = "Brouillon" ) ' +
        'WHERE StateStaId = (select sta_id from states where name = "Validee" ) '
        , { replacements: { },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (configuration) {
            Moving.update(
                {
                    formerOfficeOffId: null
                }, {
                    where: {
                        ConfigurationConId: req.body.id
                    }
                }
            ).then(function(movings){
                    console.log(movings);
                    models.sequelize.query(
                        'UPDATE configurations ' +
                        'SET StateStaId = (select sta_id from states where name = "Validee" ) ' +
                        'WHERE con_id = :id '
                        , { replacements: {id: req.body.id},
                            type: models.sequelize.QueryTypes.SELECT
                        }).then(function(conf){
                            console.log(conf);
                            res.json("success");
                        });
                });
        });

}

/**
 * get informations about all the movings of a configuration
 * start and arrival of the moving
 * people data
 * res : download .txt file
 */
const getMovingsListByConfId = (req, res) => {
    models.sequelize.query(
        'SELECT depart.name as depart, arrivee.name as arrivee, people.firstname, people.lastname, people.mail ' +
        'from movings ' +
        'join people on people.per_id = movings.PersonPerId ' +
        'join offices as depart on depart.off_id = movings.formerOfficeOffId ' +
        'join offices as arrivee on arrivee.off_id = movings.newOfficeOffId ' +
        'where movings.ConfigurationConId = :conid and movings.formerOfficeOffId is not null '
        , { replacements: { conid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (people) {
            function createFile() {
                // write header in text file
                var header = "\ufeffPersonne \u00E0 d\u00E9placer" + " : \t\t" +
                    "Bureau de d\u00E9part" + " -> " + "Bureau d'arriv\u00E9e" + "\r\n";
                fs.appendFileSync('configuration-' + req.params.id + '.txt', header, 'utf8'
                );
                // write data lines
                people.forEach(function (elem) {
                    // console.log(elem);
                    var text = elem.firstname + " " + elem.lastname + " : \t\t" +
                        elem.depart + " -> " + elem.arrivee + "\r\n";
                    fs.appendFileSync('configuration-' + req.params.id + '.txt',
                        text, 'utf8'
                    );
                });
            }
            // if a former file exists, delete it
            try {
                fs.accessSync('configuration-' + req.params.id + '.txt', fs.F_OK);
                fs.unlinkSync('configuration-' + req.params.id + '.txt', function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File deleted successfully!");
                });
                createFile();
            } catch(e) {
                console.log("No former configuration file.");
                createFile();
            }
            res.download('configuration-' + req.params.id + '.txt', 'configuration-' + req.params.id + '.txt',function (err) {
                if (err) {
                    console.log(err);
                    res.status(err.status).end();
                }
                else {
                    console.log('Sent : '+ 'configuration-' + req.params.id + '.txt');
                }
            });
        });
}

/**
 * add a new configuration with attributes name, creator, date
 * and link to copies of movings from the current configuration
 */
const addNewConfiguration = (req, res) =>
{
    models.sequelize.query(
        'SELECT * from configurations ' +
        'join States on configurations.StateStaId = States.sta_id ' +
        'where States.name = "Validee"'
        , {
            replacements: {},
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (configuration) {
            console.log(configuration);
            Moving.findAll({
                where: {
                    ConfigurationConId: configuration[0].con_id
                }
            })
                .then(function (movings) {
                    State.findOne({
                        where: {
                            name: "Brouillon"
                        }
                    }).then(function (state) {
                        Configuration.create({
                            name: req.body.name,
                            StateStaId: state.sta_id,
                            creator: req.body.creator,
                            dateCreation: Date.now()
                        }).then(function (conf) {
                            movings.forEach(function(elem){
                                Moving.create({
                                    newOfficeOffId: elem.newOfficeOffId,
                                    OfficeOffId: elem.OfficeOffId,
                                    PersonPerId: elem.PersonPerId,
                                    ConfigurationConId: conf.dataValues.con_id
                                }).then(function (newMovings) {
                                    console.log("ok" + newMovings);
                                    req.flash();
                                    res.redirect("modify"+conf.dataValues.con_id);
                                });
                            });
                        });
                    });
                });
        });
}

const saveMovings = (req, res) =>
{
    var array = req.body;
    console.log(array);
    array.forEach(function (element) {
        Office.findOrCreate({
            where: {
                name: element.new
            }
        }).then(function (newoff) {
            console.log("NEW");
            console.log(newoff[0]);
            Office.findOrCreate({
                where: {
                    name: element.former
                }
            }).then(function (formeroff) {
                console.log("FORMER");
                console.log(formeroff[0]);
                Moving.findOne({
                    where: {
                        PersonPerId: element.perId,
                        ConfigurationConId: element.conId
                    }
                }).then(function (moving) {
                    console.log("MOVING");
                    console.log(moving);
                    console.log(element.former);

                    if(element.former === "" || element.former === " " ) {
                        Office.findOne({
                            where: {
                                name: "aucun"
                            }
                        }).then(function(off){
                            Moving.create({
                                PersonPerId: element.perId,
                                newOfficeOffId: newoff[0].dataValues.off_id,
                                OfficeOffId: newoff[0].dataValues.off_id,
                                ConfigurationConId: element.conId,
                                formerOfficeOffId: off.dataValues.off_id
                            }).then(function (mov) {
                                console.log(mov);
                                req.flash('success', 'La configuration a bien &eacutet&eacute enregistr&eacutee.' +
                                    ' Avant de pouvoir valider la configuration, sa coh&eacuterence sera v&eacuterif&eacutee.');
                                res.json("success");
                            });
                        })
                    } else {
                        moving.update({
                            newOfficeOffId: newoff[0].dataValues.off_id,
                            OfficeOffId: newoff[0].dataValues.off_id,
                            formerOfficeOffId: formeroff[0].dataValues.off_id
                        }).then(function (mov) {
                            req.flash('success', 'La configuration a bien &eacutet&eacute enregistr&eacutee.' +
                                ' Avant de pouvoir valider la configuration, sa coh&eacuterence sera v&eacuterif&eacutee.');                            res.json("success");
                        });
                    }
                });
            });
        });
    });
}

/**
 * return people, office name, office id
 * for the new people in the office with more than one assigned person
 */
const reportConsistency = (req,res) => {
    models.sequelize.query(
        'select people.firstname, people.lastname, offices.name, offices.off_id from movings '+
        'join people on people.per_id = movings.personperid '+
        'join offices on offices.off_id = movings.newOfficeOffId '+
        'where newOfficeOffId in ( '+
        'select newOfficeOffId '+
        'from movings '+
        'where ConfigurationConId = :conId '+
        'group by newOfficeOffId '+
        'having count(*) > 1 ) ' +
        'and configurationConId = :conId ' +
        'and (movings.formerOfficeOffId is not null or movings.formerOfficeOffId in (select off_id from offices where name = "aucun")) ' +
        'order by offices.name'
        , {
            replacements: {conId: req.params.id},
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (info) {
            console.log(info);
            res.json(info);
        });
}


const formerPeopleByOffId = (req,res) => {
    models.sequelize.query(

        'select people.firstname, people.lastname, movings.formerOfficeOffId ' +
        'from people ' +
        'join movings on movings.PersonPerId = people.per_id ' +
        'where movings.formerOfficeOffId = :offid ' +
        'and movings.ConfigurationConId = :conid ' +
        'union all ' +
        'select people.firstname, people.lastname, movings.newOfficeOffId ' +
        'from people ' +
        'join movings on movings.PersonPerId = people.per_id ' +
        'where movings.newOfficeOffId = :offid and movings.formerOfficeOffId is null ' +
        'and movings.ConfigurationConId = :conid '
        , {
            replacements: {offid: req.params.id, conid: req.params.conid},
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (info) {
            console.log(info);
            res.json(info);
        });
}

/**
 * get informations about all the movings of a configuration
 * start and arrival of the moving
 * people data
 * res : json containing all the data
 */
const getRecapOfMovings = (req, res) => {
    models.sequelize.query(
        'SELECT depart.name as depart, arrivee.name as arrivee, people.firstname || " " || people.lastname as name, people.mail ' +
        'from movings ' +
        'join people on people.per_id = movings.PersonPerId ' +
        'join offices as depart on depart.off_id = movings.formerOfficeOffId ' +
        'join offices as arrivee on arrivee.off_id = movings.newOfficeOffId ' +
        'where movings.ConfigurationConId = :conid and movings.formerOfficeOffId is not null '
        , { replacements: { conid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (people) {
            res.json(people);
        });
}




module.exports = {
    getAllMovingsByConfIdCount,
    getPeopleMovingsByConId,
    deleteConfiguration,
    getMovingsListByConfId,
    addNewConfiguration,
    getAllConf,
    saveMovings,
    reportConsistency,
    formerPeopleByOffId,
    getRecapOfMovings,
    validateConfiguration
}