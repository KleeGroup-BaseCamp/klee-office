const peopleDatabase = require('../data/KleeGroup.json');

var models = require('../../models');
var People = models.Person;

const test = (req, res) => {
	console.log('appel du service test');
	res.json('{ toto: titi }')
};

/**
 * get people from json file
 */
const getAllPeople = (req, res) => {
	console.log('call of service to get KleeGroup.json');
	res.json(peopleDatabase);
};

/**
 * get people from db
 */
const getPeople = (req, res) => {
	People.findAll().then(function(people){
		res.json(people);
	});
};

const getLevelValidator =(req,res) =>{
	models.sequelize.query('SELECT \"Profil\".\"isValidatorLvlOne\", \"Profil\".\"isValidatorLvlTwo\", "Person"."businessUnit_id", "BusinessUnit".company_id AS company '+
        'FROM \"Person\" ' +
		'JOIN \"Profil\" ON \"Profil\".pro_id=\"Person\".profil_id '+
        'JOIN "BusinessUnit" ON "BusinessUnit".bus_id="Person"."businessUnit_id" '+
        'WHERE \"Person\".firstname = :first AND \"Person\".lastname = :last;',
        { replacements: {first: req.params.firstname, last: req.params.lastname}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(valid){
            console.log(valid)
           res.json(valid);
        });
}

const getAdministrator =(req,res) =>{
	models.sequelize.query('SELECT "Profil"."isAdministrator" '+
        'FROM "Person" ' +
		'JOIN "Profil" ON "Profil".pro_id="Person".profil_id '+
        'WHERE "Person".firstname = :first AND "Person".lastname = :last;',
        { replacements: {first: req.params.firstname, last: req.params.lastname}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(valid){
            console.log(valid)
           res.json(valid);
        });
}

const getInfoPerson =(req,res) =>{
	models.sequelize.query('SELECT \"Person\".firstname AS firstname, \"Person\".lastname AS lastname, \"Person\".mail AS mail, \"Desk\".name AS deskname, \"Site\".name AS site '+
        'FROM \"Person\" '+
		'JOIN \"Desk\" ON \"Desk\".person_id = \"Person\".per_id '+
        'JOIN \"Site\" ON \"Site\".sit_id = \"Desk\".site_id',
        { replacements: {}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(valid){
            //console.log(valid)
           res.json(valid);
        });
}

const getBusUnitCompanyByPerson = (req, res) => {
    models.sequelize.query(
        'SELECT \"BusinessUnit\".bus_id as busid, \"Company\".com_id as comid ' + 
        'FROM \"BusinessUnit\" ' +
        'JOIN \"Company\" ON \"Company\".com_id = \"BusinessUnit\".company_id ' +
        'JOIN \"Person\" ON \"Person\".\"businessUnit_id\" = \"BusinessUnit\".bus_id ' +
        'WHERE \"Person\".firstname = :first AND \"Person\".lastname = :last'
        , { replacements: {first: req.params.first, last: req.params.last},
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (valid) {
            res.json(valid);
        });
};




module.exports = {
    test,
    getAllPeople,
	getPeople,
	getLevelValidator,
	getAdministrator,
    getInfoPerson,
    getBusUnitCompanyByPerson,
}