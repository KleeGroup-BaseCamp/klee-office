const peopleDatabase = require('../data/people.json');

const test = (req, res) => {
	console.log('appel du service test');
	res.json('{ toto: titi }')
};

const getAllPeople = (req, res) => {
	res.json(peopleDatabase);
}


module.exports = {
    test,
    getAllPeople
}