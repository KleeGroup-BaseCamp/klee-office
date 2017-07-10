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
	models.sequelize.query('SELECT \"Person\".isValidatorLvlOne, \"Person\".isValidatorLevelTwo '+
        'FROM \"Person\" ' +
        'WHERE \"Person\".firstname = :first AND \"Person\".lastname = :last;',
        { replacements: {first: req.params.firstname, last: req.params.lastname}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(valid){
            console.log(valid)
           res.json(valid);
        });
}


module.exports = {
    test,
    getAllPeople,
	getPeople,
	getLevelValidator
}