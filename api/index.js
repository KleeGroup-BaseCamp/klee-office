'use strict';
// Libraries imports
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flag : 'w'});
var log_stdout = process.stdout;
// overload console.log to store logs in a file
console.log = function(d) {
	log_file.write(util.format(d) + '\n');
	log_stdout.write(util.format(d) + '\n');
};

// services
const peopleServices = require('./services/people.js');
const mapServices = require('./services/map.js');
const dataServices = require('./services/data.js');
const dataAssociationServices = require('./services/dataAssociations.js');
const localizationServices = require('./services/localization.js');
const adminServices = require('./services/admin.js');
const confServices = require('./services/configurations.js');

const API_PORT = process.env.PORT || 3000;

const app = express();

// views engine for renders
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParser.json());
// CHECK IF OK....
app.use(bodyParser.urlencoded({extended: true}))

// serve static page files
app.use(express.static('../app'));

// send flash messages to the user
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

// views
//home
app.get('/', function(req, res){
	res.render('index', { message: req.flash('success') });
});
// employee localization
app.get('/localization', function(req, res){
	res.render('tell-localization', { message: req.flash('error') });
});
// admin screen
app.get('/admin', function(req, res){
	res.render('admin', { message: req.flash('success') });
});
// configurations screen
app.get('/configurations', function(req, res){
	res.render('conf-list', { message: req.flash('success') });
});
// work on a configuration
app.get('/modify:id', function(req, res){
	res.render('modify', { message: req.flash('success') });
});

// people
// map
// admin/sync => Active directory => Save in LevelDB


app.get('/test', peopleServices.test);
app.get('/people', peopleServices.getAllPeople);
app.get('/getPeople', peopleServices.getPeople);
app.get('/maps/:name', mapServices.getMap);
app.get('/populateDB', dataServices.populate);
app.get('/associateData', dataAssociationServices.associate);
app.post('/myLocalization', localizationServices.saveMyLocalization);
app.get('/currentOfficeName/:first/:last', localizationServices.getCurrentOfficeName);
app.get('/currentOfficeNamebyId/:id', localizationServices.getCurrentOfficeNamebyId);
app.get('/getAllCompanies', adminServices.getAllCompanies);
app.get('/getDepartmentsByCompany/:id', adminServices.getDepartmentsByCompany);
app.get('/getPeopleByDepartment/:id', adminServices.getPeopleByDepartment);
app.get('/getPeopleByCompany/:id', adminServices.getPeopleByCompany);
app.post('/saveValidateur', adminServices.saveValidateur);
app.post('/updateValidateur', adminServices.updateValidateur);
app.get('/getAllValidators', adminServices.getAllValidators);
app.get('/getAllMovingsByConfIdCount/:id', confServices.getAllMovingsByConfIdCount);
app.get('/getPeopleMovingsByConId/:id', confServices.getPeopleMovingsByConId);
app.delete('/deleteConfiguration/:id', confServices.deleteConfiguration);
app.get('/getMovingsListByConfId/:id', confServices.getMovingsListByConfId);
app.post('/addNewConfiguration', confServices.addNewConfiguration);
app.post('/saveMovings', confServices.saveMovings);
app.get('/getAllConf', confServices.getAllConf);



//app.get('/maps/:number', mapServices.getMapByNumber);

console.log('Initializing the API...');

var models = require("../models");

models.sequelize.sync().then(function () {
	app.listen(API_PORT, () => {
		console.log(`API listening on port ${API_PORT}`);

});
	app.on('error', onError);
	app.on('listening', onListening);
});

function onError(error) { /* ... */
	console.log("error : " + error)
}
function onListening() { /* ... */
	console.log("success !")
}


