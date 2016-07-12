const peopleDatabase = require('../data/people.json');

const test = (req, res) => {
	console.log('appel du service test');
	res.json('{ toto: titi }')
};

const getAllPeople = (req, res) => {
	res.json(peopleDatabase);
}

const getPeople = (req, res) => {
	const name = req.params.name;
	console.log('appel du service getPerson ' + name);
	res.json('{ name: "Zhang", firstname: "Zekun" }');
};

module.exports = {
    test,
    getAllPeople,
    getPeople
}