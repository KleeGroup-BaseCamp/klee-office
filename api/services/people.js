const peopleDatabase = require('../data/KleeGroup.json');

const test = (req, res) => {
	console.log('appel du service test');
	res.json('{ toto: titi }')
};

const getAllPeople = (req, res) => {
	console.log('call of service to get KleeGroup.json');
	res.json(peopleDatabase);
};


module.exports = {
    test,
    getAllPeople
}