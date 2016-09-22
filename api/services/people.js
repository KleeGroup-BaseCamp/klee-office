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


module.exports = {
    test,
    getAllPeople,
	getPeople
}