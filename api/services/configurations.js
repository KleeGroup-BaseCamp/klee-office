/**
 * Created by msalvi on 09/09/2016.
 */

// models
var models = require('../../models');
var Company = models.Company;
var BusinessUnit = models.BusinessUnit;
var Person = models.Person;
var Profil = models.Profil;
var MoveLine = models.MoveLine;
var Desk = models.Desk;
var MoveSet = models.MoveSet;
var MoveStatus = models.MoveStatus;

// libs
var fs = require("fs");

/**
 * List all move_set (configurations)
 */
const getAllMoveSet = (req, res) => {
    models.sequelize.query(
        'SELECT set.name as name, set.creator, \'set.dateCreation\', sta.name as state, set.status_id ' +
        'FROM \"MoveSet\" as set ' +
        'JOIN \"MoveStatus\" sta on set.status_id = sta.sta_id', { replacements : {}, type: models.sequelize.QueryTypes.SELECT } ).then(function(conf){
            res.json(conf);
        });
}


/**
 * get number of movings for a configuration
 */
const countAllMoveLineByMoveSetId = (req, res) => {
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
        'FROM moveline ' +
        'WHERE moveline.move_set_id= :id ' +
        'AND moveline.fromdesk is not null ', { replacements : {id: req.params.id}, type: models.sequelize.QueryTypes.SELECT }
    ).then(function(conf){
            res.json(conf);
        }
    );
}

/**
 * get people and offices data
 * related to movings in a configuration
 */
const getPeopleMoveLineByMoveSetId = (req, res) => {
    models.sequelize.query(
        'SELECT desk.name, person.firstname, person.lastname, person.mail ' +
        'FROM \"MoveLine\" ' +
        'JOIN \"Person\" ON person.per_id = moveline.person_id ' +
        'JOIN \"Desk\" ON desk.des_id = moveline.todesk ' +
        'WHERE moveline.move_set_id = :conid '
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
const deleteMoveSet = (req, res) => {
    MoveLine.destroy({
        where: {
            move_set_id: req.params.id
        }
    }).then(function () {
        MoveSet.destroy({
            where: {
                set_id: req.params.id
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
const validateMoveSet = (req, res) => {
    console.log(req.body);

    // change status from current validated conf to draft
    models.sequelize.query(
        'UPDATE \"MoveSet\" ' +
        'SET status_id = (SELECT sta_id FROM \"MoveStatus\" WHERE name = "Brouillon" ), ' +
        'dateUpdate = date'+
        'WHERE StateStaId = (SELECT sta_id FROM \"MoveStatus\" WHERE name = "Validee" ) '
        , { replacements: { date:Date.now()},
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (configuration) {
            MoveLine.update(
                {
                    fromDesk: null
                }, {
                    where: {
                        move_set_id: req.body.id
                    }
                }
            ).then(function(moveline){
                    console.log(moveline);
                    models.sequelize.query(
                        'UPDATE \"MoveSet\" ' +
                        'SET status_id = (SELECT sta_id FROM \"MoveStatus\" WHERE name = "Validee" ) ' +
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
const getMoveLineListByMoveSetId = (req, res) => {
    models.sequelize.query(
        'SELECT depart.name as from_desk, arrivee.name as to_desk, person.firstname, person.lastname, person.mail ' +
        'FROM \"MoveLine\" ' +
        'JOIN person ON person.per_id = moveline.person_id ' +
        'JOIN desk as depart ON depart.des_id = moveline.fromDesk ' +
        'JOIN desk as arrivee ON arrivee.des_id = moveline.toDesk ' +
        'WHERE moveline.move_set_id = :setid and moveline.fromDesk is not null '
        , { replacements: { setid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (person) {
            function createFile() {
                // write header in text file
                var header = "\ufeffPersonne \u00E0 d\u00E9placer" + " : \t\t" +
                    "Bureau de d\u00E9part" + " -> " + "Bureau d'arriv\u00E9e" + "\r\n";
                fs.appendFileSync('configuration-' + req.params.id + '.txt', header, 'utf8'
                );
                // write data lines
                person.forEach(function (elem) {
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
const addNewMoveSet = (req, res) =>{
    models.sequelize.query(
        'SELECT (*) '+
        'FROM \"MoveSet\" ' +
        'JOIN \"MoveStatus\" on moveset.status_id = movestatus.sta_id ' +
        'WHERE MoveStatus.name = "Validee";'
        , {
            replacements: {},
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (moveset) {
            console.log(moveset);
            MoveLine.findAll({
                where: {
                    move_set_id: moveset[0].set_id
                }
            })
                .then(function (moveline) {
                    MoveStatus.findOne({
                        where: {
                            name: "Brouillon"
                        }
                    }).then(function (movestatus) {
                        MoveSet.create({
                            name: req.body.name,
                            status_id: movestatus.sta_id,
                            creator: req.body.creator,
                            dateCreation: Date.now(),
                            dateUpdate : Date.now()

                        }).then(function (set) {
                            moveline.forEach(function(elem){
                                MoveLine.create({
                                    fromDesk :elem.toDesk,
                                    person_id: elem.person_Id,
                                    move_set_id: set.dataValues.set_id,
                                    dateCreation : Date.now()
                                }).then(function (newMoveLine) {
                                    console.log("ok" + newMoveLine);
                                    req.flash();
                                    res.redirect("modify"+set.dataValues.set_id);
                                }).then(function (a){
                                    var nameParts = req.bodycreator.split(' ');
                                    if (nameParts[0] !== undefined && nameParts[0] !== null && nameParts[0] !== ""
                                        && nameParts[1] !== undefined && nameParts[1] !== null && nameParts[1] !== ""){
                                            models.sequelize.query('UPDATE \"MoveSet\" SET creator_id=(SELECT per_id FROM person WHERE firstname= :firstname AND lastname= :lastname '+
                                            'WHERE set_id=:setid',
                                            { replacements: {firstname:nameParts[0],lastname:nameParts[1],setid :movestatus.sta_id},type: models.sequelize.QueryTypes.UPDATE })
                                    }
                                });
                            });
                        });
                    });
                });
    });
 
    
}

const saveMoveLine = (req, res) =>{
    var array = req.body;
    console.log(array);
    array.forEach(function (element) {
        Desk.findOrCreate({
            where: {
                name: element.new
            }
        }).then(function (newdesk) {
            console.log("NEW");
            console.log(newdesk[0]);
            Desk.findOrCreate({
                where: {
                    name: element.former
                }
            }).then(function (formerdes) {
                console.log("FORMER");
                console.log(formerdes[0]);
                MoveLine.findOne({
                    where: {
                        person_id: element.perId,
                        move_set_id: element.setId
                    }
                }).then(function (moveline) {
                    console.log("MOVELINE");
                    console.log(moveline);
                    console.log(element.former);

                    if(element.former === "" || element.former === " " ) {
                        Desk.findOne({
                            where: {
                                name: "aucun"
                            }
                        }).then(function(des){
                            MoveLine.create({
                                person_id: element.perId,
                                toDesk: newdes[0].dataValues.des_id,
                                move_set_id: element.conId,
                                fromDesk: des.dataValues.des_id,
                                dateCreation : date.now()
                            }).then(function (mov) {
                                console.log(mov);
                                req.flash('success', 'La configuration a bien &eacutet&eacute enregistr&eacutee.' +
                                    ' Avant de pouvoir valider la configuration, sa coh&eacuterence sera v&eacuterif&eacutee.');
                                res.json("success");
                            });
                        })
                    } else {
                        moveline.update({
                            toDesk: newdes[0].dataValues.des_id,
                            fromDesk: formerdes[0].dataValues.des_id
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
        'select person.firstname, person.lastname, desk.name, desk.des_id from movings '+
        'join person on person.per_id = moveline.person_id '+
        'join desk on desk.des_id = moveline.toDesk '+
        'where toDesk in ( '+
        'select toDesk '+
        'from moveline '+
        'where move_set_id = :setId '+
        'group by toDesk '+
        'having count(*) > 1 ) ' +
        'and moveset = :setId ' +
        'and (moveline.fromDesk is not null or moveline.fromDesk in (select des_id from desk where name = "aucun")) ' +
        'order by desk.name'
        , {
            replacements: {setId: req.params.id},
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (info) {
            console.log(info);
            res.json(info);
        });
}


const formerPersonByDeskId = (req,res) => {
    models.sequelize.query(

        'select person.firstname, person.lastname, moveline.fromDesk ' +
        'from person ' +
        'join moveline on moveline.person_id = person.per_id ' +
        'where moveline.fromDesk = :desid ' +
        'and moveline.move_set_id = :setid ' +
        'union all ' +
        'select person.firstname, person.lastname, moveline.toDesk ' +
        'from person ' +
        'join moveline on moveline.person_id = person.per_id ' +
        'where moveline.toDesk = :desid and moveline.fromDesk is null ' +
        'and moveline.move_set_id= :setid '
        , {
            replacements: {desid: req.params.id, setid: req.params.setid},
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
const getRecapOfMoveline = (req, res) => {
    models.sequelize.query(
        'SELECT depart.name as depart, arrivee.name as arrivee, person.firstname || " " || person.lastname as name, person.mail ' +
        'from moveline ' +
        'join person on person.per_id = moveline.person_id ' +
        'join desk as depart on depart.des_id = moveline.fromDesk ' +
        'join desk as arrivee on arrivee.des_id = moveline.toDesk ' +
        'where moveline.move_set_id = :setid and moveline.fromDesk is not null '
        , { replacements: { setid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (person) {
            res.json(person);
        });
}




module.exports = {
    getAllMoveSet,
    countAllMoveLineByMoveSetId,
    getPeopleMoveLineByMoveSetId ,
    deleteMoveSet,
    validateMoveSet,
    getMoveLineListByMoveSetId,
    addNewMoveSet,
    saveMoveLine,
    reportConsistency,
    formerPersonByDeskId,
    getRecapOfMoveline
}