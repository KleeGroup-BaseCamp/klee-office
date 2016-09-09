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
 */
const saveValidateur = (req, res) => {
    console.log(req);
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
       // console.log(status);
        if (req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
        && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== ""){
            Manager.findOrCreate({
                where: {
                    firstname: req.body['firstname'],
                    lastname: req.body['lastname'],
                    mail: req.body['mail'],
                    StatusStuId: status[0].dataValues.stu_id,
                    PolePolId: req.body['pol_id']
                }
            }).then(function(managers){
                // Flash message + redirect
                req.flash('success', 'Vous avez choisi un validateur de ' + req.body.level);
                res.redirect('/admin');
            });
        } else {
            req.flash('success', 'Veuillez choisir une personne dans la liste au pr&eacutealable.');
            res.redirect('/admin');
        }
    });
};

module.exports = {
    getAllCompanies,
    getDepartmentsByCompany,
    getPeopleByDepartment,
    getPeopleByCompany,
    saveValidateur
}