/**
 * Created by msalvi on 08/09/2016.
 */


// models
var models = require('../../models');
var Company = models.Company;
var Pole = models.Pole;
var People = models.Person;
var Status = models.Status;
var Manager = models.Manager;

/**
 * get all companies of Klee
 */
const getAllCompanies = (req, res) => {
    Company.findAll().then(function(companies){
        res.json(companies);
    });
};

/**
 * get poles corresponding witha company id
 */
const getDepartmentsByCompany = (req, res) => {
    Pole.findAll({where: {
        CompanyComId: req.params.id
    }}).then(function(poles){
        res.json(poles);
    });
};

/**
 * get people working in a pole
 */
const getPeopleByDepartment = (req, res) => {
    People.findAll({where: {
        PolePolId: req.params.id
    }}).then(function(poles){
        res.json(poles);
    });
};

/**
 * get people working in a company
 */
const getPeopleByCompany = (req, res) => {
    models.sequelize.query(
        'SELECT * from people ' +
        'join poles on poles.pol_id = people.PolePolId ' +
        'join companies on companies.com_id = poles.CompanyComId ' +
        'where companies.com_id = :comid '
        , { replacements: { comid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (people) {
            res.json(people);
        });
};

/**
 * save a validateur for a pole or a company
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
    Status.findOrCreate({
        where: {
            isValidatorLvlOne: one,
            isValidatorLvlTwo: two
        }
    }).then(function(status){
        if (req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
            && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== "" && one === true){
            Manager.upsert({
                    firstname: req.body['firstname'],
                    lastname: req.body['lastname'],
                    mail: req.body['mail'],
                    StatusStuId: status[0].dataValues.stu_id,
                    PolePolId: req.body['pol_id']
                },
                { where: {
                    firstname: req.body['firstname'],
                    lastname: req.body['lastname'],
                    mail: req.body['mail'],
                    PolePolId: req.body['pol_id']
                }}).then(function(managers){
                    // Flash message
                    req.flash('success', 'Vous avez choisi un validateur de ' + req.body.level);
                });
        } if (req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
            && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== "" && one === false) {
            Pole.findAll({
                where: {
                    CompanyComId: req.body['com_id']
                }
            }).then(function(poles){
                if (req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
                    && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== "" && one === false) {
                    poles.forEach(function(pole){
                        Manager.upsert({
                                firstname: req.body['firstname'],
                                lastname: req.body['lastname'],
                                mail: req.body['mail'],
                                StatusStuId: status[0].dataValues.stu_id,
                                PolePolId: pole.pol_id
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

        }
        else {
            req.flash('success', 'Veuillez choisir une personne dans la liste au pr&eacutealable.');
        }
    });
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

    if(req.body['man_id'] !== null && req.body['man_id'] !== undefined && req.body['man_id'] !== "" && one === false){
        Manager.findOne({
            where: {
                man_id: req.body['man_id']
            }
        }).then(function(manager){
            Status.findOne({where: {
                stu_id: manager.StatusStuId
            }}).then(function(stu){
                Status.findOrCreate({
                    where: {
                        isValidatorLvlOne: one,
                        isValidatorLvlTwo: stu.isValidatorLvlTwo
                    }
                }).then(function(status){
                    manager.update({ StatusStuId: status[0].dataValues.stu_id}).then(function(manager){
                        // save the new validator
                        saveValidateur(req, res);
                    });
                });
            })
        });
    }
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
    }
    if(req.body['man_id'] === null || req.body['man_id'] === undefined || req.body['man_id'] === "") {
            // save the new validator
            saveValidateur(req, res);
        }
    };

    const getAllValidators = (req, res) => {
    models.sequelize.query(
        'SELECT managers.man_id as id, managers.firstname, managers.lastname, companies.name as company, ' +
        'companies.com_id as com_id, poles.name as pole, poles.pol_id as pol_id, stu.isValidatorLvlOne, stu.isValidatorLvlTwo ' +
        'from poles '+
        'left join managers on poles.pol_id = managers.PolePolId ' +
        'left join companies on companies.com_id = poles.CompanyComId ' +
        'left join statuses as stu on stu.stu_id = managers.StatusStuId ' +
        'order by companies.name desc, poles.name desc '
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