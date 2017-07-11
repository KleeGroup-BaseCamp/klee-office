'use strict';
// Libraries imports
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var saml2 = require('saml2-js');
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


//app.listen(3000);


// views engine for renders
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParser.json());
// CHECK IF OK....
app.use(bodyParser.urlencoded({extended: false}))

// serve static page files
app.use(express.static('../app'));

// send flash messages to the user
app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret option',
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true,
            maxAge: 60000 
          }
}));
app.use(flash());

 //Partie Authentification SSO - need IDP from support

//authentication with saml2nm
// create service provider
var sp_options = {
	entity_id: "http://local-map.dev.klee.lan.net/",
	private_key: fs.readFileSync("localmap_privatekey.pem").toString(),
	certificate: fs.readFileSync("cert.pem").toString(),
	assert_endpoint : "http://local-map.dev.klee.lan.net/assert"
};
var sp= new saml2.ServiceProvider(sp_options);

//create identity provider (to complete)
var idp_options = {
  sso_login_url: "https://sso.kleegroup.com/saml2/idp/SSOService.php",
  sso_logout_url: "https://sso.kleegroup.com/saml2/idp/SingleLogoutService.php",
  certificates: fs.readFileSync("certificate_idp1.crt").toString()
};
var idp = new saml2.IdentityProvider(idp_options);
// Starting point for login 
app.get("/login", function(req, res) {
var options = {relay_state: "/"};
  sp.create_login_request_url(idp, options, function(err, login_url, request_id) {
    if (err != null){
	console.log("Echec login");
      return res.send(500);}
    console.log("Login Fait!");
    console.log("Login Url : " + login_url);
    console.log("Request ID : " + request_id);	
    res.redirect(login_url);
  });
});
// Assert endpoint for when login completes 
app.post("/saml2/acs", function(req, res) { // assert
  var options = {
			request_body: req.body,
			allow_unencrypted_assertion: true,
			require_session_index: false,
			relay_state: "/" 	
		};
  //console.log(req);
  //console.log("Req.body : " + req.body);
  sp.post_assert(idp, options, function(err, saml_response) {
    if (err != null){
	console.log("Echec Assert!");
	console.log(err);
	console.log(saml_response);
	return res.send("Erreur Assertion");
    }
    
    console.log("Assert Succeed");
    // Save name_id and session_index for logout 
    var name_id = saml_response.user.attributes.uid[0];
    res.send(name_id);
  });

	//res.send("TITI");  
});
// Starting point for logout 
app.get("/saml2/sls", function(req, res) { //logout
  var options = {
			name_id: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
			allow_unencrypted_assertion: true,
                	require_session_index: false
		};
  console.log(req.body);
  sp.create_logout_request_url(idp, {}, function(err, logout_url) {
    if (err != null){
      console.log(err);	
      return res.send("Erreur déconnexion");}
  console.log("Logout URL : " + logout_url);  
  res.redirect(logout_url);
  });
});

app.get("/saml2/slsResponse", function(req, res){ //app.post ??
  var options = {
    in_response_to: request_id //req.id ??
   // sign_get_request: aaaaaaaaa
  };

  sp.create_logout_response_url(IdP, options, function(err, logout_url){
    if (err != null)
      return res.send(500);
    res.redirect(logout_url);
  });
});

app.get("/welcome", function (req, res) {
  // On stocke dans la session
  req.session.user = "Toto";
  console.log(req.session);
  res.send("Hello " + req.session.user);
});
 
// views
//home
app.get('/', function(req, res){
	req.session.user = "User";
  req.session.desk = "Desk";
  res.render('index', { message: req.flash('success'),
                        myName: req.session.user,
                        myDesk: req.session.desk});
});
// employee localization
app.get('/localization', function(req, res){
  req.session.user = "User";
  req.session.desk = "Desk";
	res.render('tell-localization', { message: req.flash('success'),
                        myName: req.session.user,
                        myDesk: req.session.desk});
});
// admin screen
app.get('/admin', function(req, res){
  req.session.user = "User";
  req.session.desk = "Desk";
	res.render('admin', { message: req.flash('success'),
                        myName: req.session.user,
                        myDesk: req.session.desk});
});
// configurations screen
app.get('/configurations', function(req, res){
  req.session.user = "User";
  req.session.desk = "Desk";
	res.render('conf-list', { message: req.flash('success'),
                        myName: req.session.user,
                        myDesk: req.session.desk});
});
// work on a configuration
app.get('/modify:id', function(req, res){
  req.session.user = "User";
  req.session.desk = "Desk";
	res.render('modify', { message: req.flash('success'),
                        myName: req.session.user,
                        myDesk: req.session.desk});
});
// check consistency
app.get('/consistency:id', function(req, res){
  req.session.user = "User";
  req.session.desk = "Desk";
	res.render('consistency-list', { message: req.flash('success'),
                        myName: req.session.user,
                        myDesk: req.session.desk});;
});

// people
// map
// admin/sync => Active directory => Save in LevelDB


app.get('/test', peopleServices.test);
app.get('/people', peopleServices.getAllPeople);
app.get('/getPeople', peopleServices.getPeople);
app.get('/getLevelValidator/:firstname/:lastname', peopleServices.getLevelValidator);
app.get('/getAdministrator/:firstname/:lastname', peopleServices.getAdministrator);
app.get('/maps/:name', mapServices.getMap);
app.get('/populateDB', dataServices.populate);
app.get('/associateData', dataAssociationServices.associate);
app.post('/myLocalization', localizationServices.saveMyLocalization);
app.get('/currentOfficeName/:first/:last', localizationServices.getCurrentDeskName);
app.get('/currentOfficeNamebyId/:id', localizationServices.getCurrentDeskNamebyId);
app.get('/getPersonByDesk/:name', localizationServices.getPersonByDesk);
app.get('/getAllCompanies', adminServices.getAllCompanies);
app.get('/getDepartmentsByCompany/:id', adminServices.getDepartmentsByCompany);
app.get('/getPeopleByDepartment/:id', adminServices.getPeopleByDepartment);
app.get('/getPeopleByCompany/:id', adminServices.getPeopleByCompany);
app.post('/saveValidator', adminServices.saveValidateur);
app.post('/updateValidateur', adminServices.updateValidateur);
app.post('/saveAdministrator', adminServices.saveAdministrator);
app.get('/getAllValidators', adminServices.getAllValidators);
app.get('/getValidatorsByDep/:id', adminServices.getValidatorsByDep);
app.get('/getAllMovingsByConfIdCount/:id', confServices.countAllMoveLineByMoveSetId);
app.get('/getPeopleMovingsByConId/:id', confServices.getPeopleMoveLineByMoveSetId);
app.delete('/deleteConfiguration/:id', confServices.deleteMoveSet);
app.get('/getMovingsListByConfId/:id', confServices.getMoveLineListByMoveSetId);
app.post('/addNewConfiguration', confServices.addNewMoveSet);
app.post('/saveMovings', confServices.saveMoveLine);
app.post('/validateConfiguration', confServices.validateMoveSet);
app.get('/getAllConf', confServices.getAllMoveSet);
app.get('/reportConsistency/:id', confServices.reportConsistency);
app.get('/formerPeopleByOffId/:id/:conid', confServices.formerPersonByDeskId);
app.get('/getRecapOfMovings/:id', confServices.getRecapOfMoveline);


        
   

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


