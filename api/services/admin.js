/**
 * Created by msalvi on 08/09/2016.
 */


// models
var models = require('../../models');
var Company = models.Company;
var BusinessUnit = models.BusinessUnit;
var Person = models.Person;
var Profil = models.Status;

/**
 * get all companies of Klee
 */
const getAllCompanies = (req, res) => {
    Company.findAll().then(function(company){
        res.json(company);
    });
};

/**
 * get business unit (poles) corresponding with a company id
 */
const getDepartmentsByCompany = (req, res) => {
    BusinessUnit.findAll({where: {
        company_id: req.params.id
    }}).then(function(businessunit){
        res.json(businessunit);
    });
};

/**
 * get people working in a business unit (pole)
 */
const getPeopleByDepartment = (req, res) => {
    Person.findAll({where: {
        businessUnit_id: req.params.id
    }}).then(function(person){
        res.json(person);
    });
};

/**
 * get people working in a company
 */
const getPeopleByCompany = (req, res) => {
    models.sequelize.query(
        'SELECT * from person ' +
        'JOIN businessunit ON businessunit.bus_id = person.businessunit_id ' +
        'JOIN company ON company.com_id = businessunit.company_id ' +
        'WHERE company.com_id = :comid '
        , { replacements: { comid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (people) {
            res.json(people);
        });
};

/**
 * save a validator for a businessUnit or a company (update his profil with the correct level)
 * if no one was set before
 */
const saveValidateur = (req, res) => {
    var one = false;
    var two = false;
    if (req.body.level === "Niveau 1"){
        one = true;
    }
    else if (req.body.level === "Niveau 2"){
        two = true;
    }
    /*Profil.findOrCreate({
        where: {                                   
            isValidatorLvlOne: one,  //validator for a business unit
            isValidatorLvlTwo: two   //validator for a company (able to modify anything from any pole)
        }
    }).then(function(profil){*/
    if (req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
        && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== ""){ 
            Person.findOne({           //first step : update former validator ()
                    where: {
                    per_id: req.body['per_id']
                    }
            }).then(function(new_manager){
                    new_manager.update({dateUpdate : new Date()})
            }).then(function(new_manager){
                    Profil.findOne({where: {
                        pro_id: new_manager.profil_id
            }}).then(function(profil){
                    profil.update({isValidatorLvlOne :one,isValidatorLvlTwo:two})
                }).then(function(profil){                                
                    // Flash message + redirect
                    req.flash('success', 'Vous avez choisi un validateur de ' + req.body.level)})
            });
    }
           /* Person.upsert({
                    firstname: req.body['firstname'],
                    lastname: req.body['lastname'],
                    mail: req.body['mail'],
                    dateCreation : new Date(),
                    businessUnit_id: req.body['bus_id'],
                    profil_id: profil[0].dataValues.pro_id
                },
                { where: {
                    firstname: req.body['firstname'],
                    lastname: req.body['lastname'],
                    mail: req.body['mail'],
                    businessUnit_id: req.body['bus_id']
                }}).then(function(managers){
                    // Flash message
                    req.flash('success', 'Vous avez choisi un validateur de ' + req.body.level);
                });
            }*//*if (req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
            && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== "" && two === true) {  //only for validator lvl 2
            BusinessUnit.findAll({
                where: {
                    company_id: req.body['com_id']
                }
            }).then(function(businessunits){
                if (req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
                    && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== "" && two === true) {
                    businessunits.forEach(function(unit){
                        Person.upsert({
                                firstname: req.body['firstname'],
                                lastname: req.body['lastname'],
                                mail: req.body['mail'],
                                StatusStuId: status[0].dataValues.stu_id,
                                PolePolId: unit.pol_id
                            },
                            {
                                where: {
                                    firstname: req.body['firstname'],
                                    lastname: req.body['lastname'],
                                    mail: req.body['mail'],
                                    PolePolId: pole.pol_id
                                }
                            }).then(function (managers) {
                                // Flash message + redirect
                                req.flash('success', 'Vous avez choisi un validateur de ' + req.body.level);
                            });
                    });
                }
            });

            }*/
    else {
            req.flash('success', 'Veuillez choisir une personne dans la liste au pr&eacutealable.');
        }
    //});
    res.redirect('/admin');
};

/**
 * update former validator
 * create new one
 */
const updateValidateur = (req, res) =>
{
    /**
     * if a validator is already defined for the pole or the company
     * unset the booleans
     */
    var one = true;
    var two = true;
    // if request concerns a validator lvl one
    // set the previous one's boolean isValidatorLvlOne to false
    if (req.body.level === "Niveau 1"){
        one = false;
    }
    // if it is validator lvl 2
    // set the previous one's boolean isValidatorLvlTwo to false
    if (req.body.level === "Niveau 2"){
        two = false;
    }

    if(req.body['per_id'] !== null && req.body['per_id'] !== undefined && req.body['per_id'] !== "" && one === false){ //for a validator lvl 1
        Person.findOne({           //first step : update former validator (update his profil)
            where: {
                per_id: req.body['per_id']
            }
        }).then(function(manager){
            Profil.findOne({where: {
                pro_id: manager.profil_id
            }}).then(function(profil){
                    profil.update({isValidatorLvlOne :one})
                }).then(function(profil){
                        // step 2 : save the new validator
                        saveValidateur(req, res);
                });
            });
    }
    if(req.body['per_id'] !== null && req.body['per_id'] !== undefined && req.body['per_id'] !== "" && two === false){ //for a validator lvl 2
        Person.findOne({           //first step : update former validator ()
            where: {
                per_id: req.body['per_id']
            }
        }).then(function(manager){
            Profil.findOne({where: {
                pro_id: manager.profil_id
            }}).then(function(profil){
                    profil.update({isValidatorLvlTwo :two})
                }).then(function(profil){
                        // save the new validator
                        saveValidateur(req, res);
                });
            });
    }
 /*
    if(req.body['man_id'] !== null && req.body['man_id'] !== undefined && req.body['man_id'] !== "" && two === false) {
        Manager.findOne({
            where: {
                man_id: req.body['man_id']
            }
        }).then(function (man) {
            Status.findOne({
                where: {
                    stu_id: man.StatusStuId
                }
            }).then(function (stu) {
                Status.findOrCreate({
                    where: {
                        isValidatorLvlOne: stu.isValidatorLvlOne,
                        isValidatorLvlTwo: two
                    }
                }).then(function (status) {
                    Manager.findOne({
                        where: {
                            man_id: req.body['man_id']
                        }
                    }).then(function (manager) {
                        Manager.update({StatusStuId: status[0].dataValues.stu_id}, {
                            where: {
                                firstname: manager.dataValues.firstname,
                                lastname: manager.dataValues.lastname
                            }
                        });
                        // save the new validator
                        saveValidateur(req, res);
                    });
                });
            });
        });
    }*/
    if(req.body['per_id'] === null || req.body['per_id'] === undefined || req.body['per_id'] === "") { //no former validator
            // save the new validator
            saveValidateur(req, res);
        }
};

const getAllValidators = (req, res) => {
    models.sequelize.query(
        'SELECT person.per_id as id, person.firstname, person.lastname, company.name as company, ' +
        'company.com_id as com_id, businessunit.name as pole, businessunit.pol_id as pol_id, profil.isValidatorLvlOne as lvlone, profil.isValidatorLvlTwo as lvltwo' +
        'FROM businessunit'+
        'LEFT JOIN person ON businessunit.bus_id = person.businessUnit_id ' +
        'LEFT JOIN company ON company.com_id = businessunit.company_id ' +
        'LEFT JOIN profil ON profil.pro_id = person.profil_id ' +
        'WHERE (profil.isValidatorLvlOne=true OR profil.isValidatorLvlTwo=true)'+
        'ORDER BY company.name desc, businessunit.name desc '
        , { replacements: { },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (managers) {
            res.json(managers);
        });
}

    module.exports = {
        getAllCompanies,
        getDepartmentsByCompany,
        getPeopleByDepartment,
        getPeopleByCompany,
        saveValidateur,
        getAllValidators,
        updateValidateur
    }