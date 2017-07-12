/**
 * Created by msalvi on 08/09/2016.
 */


// models
var models = require('../../models');
var Company = models.Company;
var BusinessUnit = models.BusinessUnit;
var Person = models.Person;
var Profil = models.Profil;

/**
 * get all companies of Klee
 */
const getAllCompanies = (req, res) => {
    Company.findAll().then(function(company){
        res.json(company);
    });
};

/**
 * get business unit (poles) corresponding with a company id
 */
const getDepartmentsByCompany = (req, res) => {
    BusinessUnit.findAll({where: {
        company_id: req.params.id
    }}).then(function(businessunit){
        res.json(businessunit);
    });
};

/**
 * get people working in a business unit (pole)
 */
const getPeopleByDepartment = (req, res) => {
    Person.findAll({where: {
        businessUnit_id: req.params.id
    }}).then(function(person){
        res.json(person);
    });
};

/**
 * get people working in a company
 */
const getPeopleByCompany = (req, res) => {
    models.sequelize.query(
        'SELECT * from \"Person\" ' +
        'JOIN \"BusinessUnit\" ON \"BusinessUnit\".bus_id = \"Person\".\"businessUnit_id\" ' +
        'JOIN \"Company\" ON \"Company\".com_id = \"BusinessUnit\".company_id ' +
        'WHERE \"Company\".com_id = :comid '
        , { replacements: { comid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (people) {
            res.json(people);
        });
};

/**
 * save a validator for a businessUnit or a company (update his profil with the correct level)
 * if no one was set before
 */
const saveValidateur = (req, res) => { //req contains {level :"1",firstname,lastname}
    var one = false;
    var two = false;
    if (req.body.level === "1"){ //responsible for his own pole
        one = true;
    }
    if (req.body.level === "2"){//responsible for his own company
        two = true;
        console.log("change validator 2");
    }
    if (req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
        && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== ""){ 
            Person.findOne({           //find the person
                   where: {lastname:req.body.lastname,firstname: req.body.firstname}
            }).then(function(new_manager){ 
                console.log(new_manager)
                console.log("new_manager")     //find his profil
                    new_manager.update({dateUpdate : new Date()})
                    Profil.findOne({where: {
                        pro_id: new_manager.dataValues.profil_id}})
                    .then(function(profil){          //update his profil
                        if (one===true){
                            profil.update({isValidatorLvlOne :one})                               
                            // Flash message + redirect
                            req.flash('success', 'Vous avez choisi un validateur de ' + req.body.level)
                        }
                        if (two===true){
                            profil.update({isValidatorLvlTwo:two})                               
                            // Flash message + redirect
                            req.flash('success', 'Vous avez choisi un validateur de ' + req.body.level)                   
                        }
            
            });
            })
    }
    else {
            req.flash('success', 'Veuillez choisir une personne dans la liste au pr&eacutealable.');
        }
    res.redirect('/admin');
};

/**
 * update former validator
 * create new one
 */
const updateValidateur = (req, res) => //req contains {level ,firstname,lastname}
 {
    /**
     * if a validator is already defined for the pole or the company
     * unset the booleans
     */
    var one = true;
    var two = true;
    // if request concerns a validator lvl one
    // set the previous one's boolean isValidatorLvlOne to false
    if (req.body.level === "1"){
        one = false;
    }
    // if it is validator lvl 2
    // set the previous one's boolean isValidatorLvlTwo to false
    if (req.body.level === "2"){
        two = false;
    }

    if(req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
        && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== "" && one === false){ //for a validator lvl 1
        // step 1: update the former manager (update his profil)
        console.log("search the former manager")
        Person.findOne({                        //find the new manager
            where: {lastname:req.body.lastname,firstname: req.body.firstname}
        }).then(function(new_manager){         //find the validator Lvl One from his pole
            models.sequelize.query('SELECT * FROM \"Person\" '+
                'JOIN \"Profil\" ON \"Profil\".pro_id =\"Person\".profil_id '+
                'WHERE \"Person\".\"businessUnit_id\"= :id AND \"Profil\".\"isValidatorLvlOne\"=true;',
            { replacements: {id: new_manager.dataValues.businessUnit_id},type: models.sequelize.QueryTypes.SELECT
            }).then(function(former_manager){ //find his profil
                    Profil.findOne({
                        where : {pro_id : former_manager[0].profil_id}
                    }).then(function(profil){                           //update his profil
                        profil.update({isValidatorLvlOne :one})
                    .then(function(profil){
                        console.log("i'm here")
                        // step 2 : save the new validator
                        saveValidateur(req, res);
                    });
                    })
            })
        })
    }

    if(req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
        && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== "" && two === false){ //for a validator lvl 2
        // step 1: update the former manager (update his profil)
        Person.findOne({                        //find the new manager
            where: {lastname:req.body.lastname,firstname: req.body.firstname}
        }).then(function(new_manager){          //find his business unit
                BusinessUnit.findOne({
                    where : {bus_id : new_manager.businessUnit_id}
                }).then(function(pole){             //find the validatorTwo from his company
                    models.sequelize.query('SELECT \"Person\".profil_id FROM \"Person\" '+
                        'JOIN \"Profil\" ON \"Person\".profil_id=\Profil\".pro_id '+
                        'JOIN \"BusinessUnit\" ON  \"BusinessUnit\".bus_id=\"Person\".\"businessUnit_id\" '+ 
                        'WHERE \"BusinessUnit".\"company_id\"= :comid AND \"Profil\".\"isValidatorLvlTwo\"=true;',
                        {remplacement :{comid : pole.dataValues.company_id},type : models.sequelize.QueryTypes.SELECT})
                    .then(function(profil_id_former_manager){               //find his profil
                        Profil.findOne({where : {pro_id : profil_id_former_manager}
                        }).then(function(profil){                           //update his profil
                            profil.update({isValidatorLvlOne :one})
                        }).then(function(profil){
                        // step 2 : save the new validator
                            saveValidateur(req, res);
                        });
                    })
                })
        })
    }
};

const getAllValidators = (req, res) => {
    models.sequelize.query(
        'SELECT \"Person\".per_id as id, \"Person\".firstname, \"Person\".lastname, \"Company\".name as company, ' +
        '\"Company\".com_id as com_id, \"BusinessUnit\".name as pole, \"BusinessUnit\".bus_id as pol_id, \"Profil\".\"isValidatorLvlOne\" as lvlone, \"Profil\".\"isValidatorLvlTwo\" as lvltwo ' +
        'FROM \"BusinessUnit\" '+
        'LEFT JOIN \"Person\" ON \"BusinessUnit\".bus_id = \"Person\".\"businessUnit_id\" ' +
        'LEFT JOIN \"Company\" ON \"Company\".com_id = \"BusinessUnit\".company_id ' +
        'LEFT JOIN \"Profil\" ON \"Profil\".pro_id = \"Person\".profil_id ' +
        'WHERE (\"Profil\".\"isValidatorLvlOne\"=true OR \"Profil\".\"isValidatorLvlTwo\"=true)'+
        'ORDER BY \"Company\".name desc, \"BusinessUnit\".name desc;'
        , { replacements: { },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (managers) {
            res.json(managers);
        });
}

const getValidatorsByDep = (req, res) => {
    models.sequelize.query(
        'SELECT \"Person\".per_id as id, \"Person\".firstname, \"Person\".lastname, \"Company\".name as company, ' +
        '\"Company\".com_id as com_id, \"BusinessUnit\".name as pole, \"BusinessUnit\".bus_id as pol_id, \"Profil\".\"isValidatorLvlOne\" as lvlone, \"Profil\".\"isValidatorLvlTwo\" as lvltwo ' +
        'FROM \"BusinessUnit\" '+
        'LEFT JOIN \"Person\" ON \"BusinessUnit\".bus_id = \"Person\".\"businessUnit_id\" ' +
        'LEFT JOIN \"Company\" ON \"Company\".com_id = \"BusinessUnit\".company_id ' +
        'LEFT JOIN \"Profil\" ON \"Profil\".pro_id = \"Person\".profil_id ' +
        'WHERE (\"Profil\".\"isValidatorLvlOne\"=true OR \"Profil\".\"isValidatorLvlTwo\"=true) AND \"BusinessUnit\".bus_id=:id;'
        , { replacements: {id :req.params.id},
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (managers) {
            res.json(managers);
        });
}


const deleteValidator = (req,res) =>{
   if (req.body.id !== null && req.body.id !== undefined && req.body.id !== ""){ 
            Person.findOne({           //find the person
                   where: {per_id :req.body.id}
            }).then(function(former_admin){      //find his profil
                former_admin.update({dateUpdate : new Date()});
                Profil.findOne({where: {pro_id: former_admin.dataValues.profil_id}
                }).then(function(profil){           //update his profil
                    if (req.body.level==="1"){
                        profil.update({isValidatorLvlOne : false})
                    }
                    else if(req.body.level==="2"){
                        profil.update({isValidatorLvlTwo : false})
                    }                               
                    // Flash message + redirect
                req.flash('success', 'Vous avez choisi un administrateur ')});
            })
    }
    else {
            req.flash('success', 'Veuillez choisir une personne dans la liste au pr&eacutealable.');
        }
    res.redirect('/admin');
}

const saveAdministrator = (req, res) => {
    if (req.body['firstname'] !== null && req.body['firstname'] !== undefined && req.body['firstname'] !== ""
        && req.body['lastname'] !== null && req.body['lastname'] !== undefined && req.body['lastname'] !== ""){ 
            Person.findOne({           //find the person
                   where: {lastname:req.body.lastname,firstname: req.body.firstname}
            }).then(function(new_admin){      //find his profil
                    new_admin.update({dateUpdate : new Date()})
                    Profil.findOne({where: {
                        pro_id: new_admin.dataValues.profil_id}})
            .then(function(profil){           //update his profil
                    profil.update({isAdministrator : true})                               
                    // Flash message + redirect
                    req.flash('success', 'Vous avez choisi un administrateur ')});})
    }
    else {
            req.flash('success', 'Veuillez choisir une personne dans la liste au pr&eacutealable.');
        }
    res.redirect('/admin');
}

    module.exports = {
        getAllCompanies,
        getDepartmentsByCompany,
        getPeopleByDepartment,
        getPeopleByCompany,
        saveValidateur,
        getAllValidators,
        updateValidateur,
        saveAdministrator,
        getValidatorsByDep,
        deleteValidator
    }