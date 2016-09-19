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
        'where movings.ConfigurationConId = :conid and movings.formerOfficeOffId is not null '
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
 * if consistent (checked before)
 */
const validateConfiguration = (req, res) => {

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
        'where name = "Configuration premiere"'
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
                                    res.flash();
                                    res.redirect();
                                });
                            });
                        });
                    });
                });
        });
}

module.exports = {
    getAllMovingsByConfIdCount,
    getPeopleMovingsByConId,
    deleteConfiguration,
    getMovingsListByConfId,
    addNewConfiguration,
    getAllConf
}