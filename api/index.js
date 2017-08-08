'use strict';
// Libraries imports
const express = require('express');
//const fileUpload = require('express-fileupload');
const cors = require('cors')
const bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
var sessionStore = new session.MemoryStore();
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var saml2 = require('saml2-js');
var fs = require('fs');
var util = require('util');
//var JSFtp = require("jsftp");
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
//app.use('../app', express.static('app'));
// send flash messages to the user
app.use(cookieParser('secret'));
app.use(session({store: sessionStore,
		secret: 'secretsecret',
		resave: false,
		saveUninitialized: true
		/*cookie: { secure: true, maxAge: 60000 }*/}));
app.use(flash());
//app.use(fileUpload());

 //Partie Authentification SSO - need IDP from support

//authentication with saml2-js
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
  certificates: fs.readFileSync("certificate_idp.crt").toString()
};
var idp = new saml2.IdentityProvider(idp_options);
//var name_id;
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
	return res.send("Erreur Assertion");
    }
    
    console.log("Assert Succeed");
    // Save name_id and session_index for logout 
    req.session.mail = saml_response.user.attributes.uid[0];
    req.session.firstName = saml_response.user.attributes.givenName[0];
    req.session.lastName = saml_response.user.attributes.sn[0];
    /*res.render('index', { message: req.flash('success'),
			  myMail: name_id});*/
	//res.send(name_id);
	console.log(req.session);
	console.log(req.sessionID);
	/*req.session.save(function(err)
	{
		if(err){
			console.log(err);}
		else{
		req.session.user = saml_response.user.attributes.uid[0];
		console.log(req.session);
		console.log(req.sessionID);
		res.redirect("/accueil");}
	});*/
	res.redirect("/");
  });  
});

// Starting point for logout 
app.get("/saml2/sls", function(req, res) { //logout
  var options = {
			name_id: req.session.user,
			//allow_unencrypted_assertion: true
                	//require_session_index: false
		};
  //console.log(req.body);
  sp.create_logout_request_url(idp, options, function(err, logout_url) {
    if (err != null){
      console.log(err);	
      return res.send("Erreur déconnexion");}
  console.log("Logout URL : " + logout_url);
  console.log("Logout Successful");  
  res.redirect(logout_url);
  });
});

app.post("/saml2/slsResponse", function(req, res){ //app.post ??
  sp.create_logout_response_url(idp, {}, function(err, logout_url){
    if (err != null)
      return res.send(500);
    res.send("Logout Response : OK");
  });
});
 
// views
var firstname="Marjorie"
var lastname="JULIO"
//home
app.get('/', function(req, res){
	console.log(req.session);
	console.log(req.sessionID);
	res.render('index', { message: req.flash('success'),
				myFirstName: firstname,
				myLastName: lastname}) 
	//res.redirect('/login')
 });
// employee localization
/*app.get('/localization', function(req, res){
	res.render('tell-localization', { message: req.flash('error') });
});*/
// admin screen
app.get('/admin', function(req, res){
	res.render('admin', { message: req.flash('success'),
					myFirstName: firstname,
					myLastName: lastname });
});
// configurations screen
app.get('/configurations', function(req, res){
	res.render('conf-list', { message: req.flash('success'),
				myFirstName: firstname,
				myLastName: lastname });
});
// work on a configuration
app.get('/modify:id', function(req, res){
	res.render('modify', { message: req.flash('success'),
				myFirstName: firstname,
				myLastName: lastname });
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.sampleFile;
  // Use the mv() method to place the file somewhere on your server 
  console.log(sampleFile.name);
  sampleFile.mv('data/maps/'+sampleFile.name, function(err) {
	if (err)
      return res.send(err);
 	res.redirect("/admin");
  });
});

// check consistency
/*app.get('/consistency:id', function(req, res){
	res.render('consistency-list', { message: req.flash('success'),
				myFirstName: "Alain",
				myLastName: "GOURLAY" });
});*/

// people
// map
// admin/sync => Active directory => Save in LevelDB



app.get('/people', peopleServices.getAllPeople);
app.get('/getPeople', peopleServices.getPeople);
app.get('/getInfoPerson', peopleServices.getInfoPerson);
app.get('/getLevelValidator/:firstname/:lastname', peopleServices.getLevelValidator);
app.get('/getAdministrator/:firstname/:lastname', peopleServices.getAdministrator);
app.get('/getBusUnitCompanyByPerson/:first/:last', peopleServices.getBusUnitCompanyByPerson);
app.get('/getLastMoveline/:firstname/:lastname', peopleServices.getLastMoveline);

app.get('/maps/:name', mapServices.getMap);

app.get('/populateDB', dataServices.populate);

app.get('/associateData', dataAssociationServices.associate);

app.post('/myLocalization', localizationServices.saveMyLocalization);
app.get('/currentOfficeName/:first/:last', localizationServices.getCurrentDeskName);
app.get('/currentOfficeNamebyId/:id', localizationServices.getCurrentDeskNamebyId);
app.get('/getOverOccupiedDesk/', localizationServices.getOverOccupiedDesk);
app.get('/getPersonByDesk/:name', localizationServices.getPersonByDesk);

app.get('/getAllCompanies', adminServices.getAllCompanies);
app.get('/getDepartmentsByCompany/:id', adminServices.getDepartmentsByCompany);
app.get('/getPeopleByDepartment/:id', adminServices.getPeopleByDepartment);
app.get('/getPeopleByCompany/:id', adminServices.getPeopleByCompany);
app.post('/saveValidator', adminServices.saveValidateur);
app.post('/updateValidator', adminServices.updateValidateur);
app.post('/deleteValidator', adminServices.deleteValidator);
app.post('/saveAdministrator', adminServices.saveAdministrator);
app.post('/deleteAdministrator', adminServices.deleteAdministrator);
app.get('/getAllValidators', adminServices.getAllValidators);
app.get('/getValidatorsByDep/:id', adminServices.getValidatorsByDep);
app.get('/getDepartmentsByCompanyName/:name', adminServices.getDepartmentsByCompanyName);

app.get('/getAllMovingsByConfIdCount/:id', confServices.countAllMoveLineByMoveSetId);
app.get('/getPeopleMovingsByConId/:id', confServices.getPeopleMoveLineByMoveSetId);
app.delete('/deleteConfiguration/:setid', confServices.deleteMoveSet);
app.get('/getMovingsListByConfId/:id', confServices.getMoveLineListByMoveSetId);
app.post('/addNewConfiguration', confServices.addNewMoveSet);
app.post('/updateDateMoveSet/:confId', confServices.updateDateMoveSet);
app.get('/checkFromDeskMoveLine/:confId', confServices.checkFromDeskMoveline);
app.get('/checkToDeskMoveLine/:confId', confServices.checkToDeskMoveline);
app.post('/setInvalidMoveline/:movid', confServices.setInvalidMoveline);
app.get('/isConfValid/:confId', confServices.isConfValid);
app.post('/addMoveLine', confServices.addMoveLine);
app.post('/deleteMoveLine', confServices.deleteMoveLine);
app.post('/deleteMoveLineIfFind', confServices.deleteMoveLineIfFind);
app.post('/validateConfiguration', confServices.validateMoveSet);
app.get('/getAllConf', confServices.getAllMoveSet);
app.get('/getConfById/:confId', confServices.getMoveSetById);
app.get('/getLastMoveSet/', confServices.getLastMoveSet);
app.get('/getRecapOfMovings/:id', confServices.getRecapOfMoveline);
app.get('/getNoPlacePersonByBusUnit/:busid/:comid', confServices.getNoPlacePersonByBusUnit);
app.get('/getNoPlacePersonByCompany/:comid', confServices.getNoPlacePersonByCompany);







        
   

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


