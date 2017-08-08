/**
 * Created by msalvi on 09/09/2016.
 */

// models
var models = require('../../models');
var Company = models.Company;
var BusinessUnit = models.BusinessUnit;
var Person = models.Person;
var Profil = models.Profil;
var MoveLine = models.MoveLine;
var Desk = models.Desk;
var MoveSet = models.MoveSet;
var MoveStatus = models.MoveStatus;
var Site=models.Site;

// libs
var fs = require("fs");

/**
 * List all move_set (configurations)
 */
const getAllMoveSet = (req, res) => {
        models.sequelize.query(
        'SELECT set.name as name, set.set_id, set.creator, set.\"dateCreation\", sta.name as state, set.status_id,set.\"dateUpdate\" as date ' +
        'FROM \"MoveSet\" as set ' +
        'JOIN \"MoveStatus\" sta on set.status_id = sta.sta_id '+
        'WHERE sta.name<> :sta '+
        'ORDER BY date;'
        , { replacements : {sta:"Déplacement personnel"}, type: models.sequelize.QueryTypes.SELECT } ).then(function(conf){
            res.json(conf);
        });
}

const getMoveSetById = (req,res) => {
        models.sequelize.query(
        'SELECT set.name as name, set.set_id, set.creator, set.\"dateCreation\", sta.name as state, set.status_id,set.\"dateUpdate\" as date ' +
        'FROM \"MoveSet\" as set ' +
        'JOIN \"MoveStatus\" sta on set.status_id = sta.sta_id '+
        'WHERE set_id= :id ;'
        , { replacements : {id: req.params.confId}, type: models.sequelize.QueryTypes.SELECT } ).then(function(conf){
            res.json(conf);
        });
}

/**
 * get number of movings for a configuration
 */
const countAllMoveLineByMoveSetId = (req, res) => {
    models.sequelize.query(
        'SELECT count(*) as count ' +
        'FROM \"MoveLine\" ' +
        'WHERE \"MoveLine\".move_set_id= :id ', { replacements : {id: req.params.id}, type: models.sequelize.QueryTypes.SELECT }
    ).then(function(conf){
            res.json(conf);
        }
    );
}

/**
 * get people and offices data
 * related to movings in a configuration
 */
const getPeopleMoveLineByMoveSetId = (req, res) => {
    models.sequelize.query(
        'SELECT \"Desk\".name, \"Person\".firstname, \"Person\".lastname, \"Person\".mail ' +
        'FROM \"MoveLine\" ' +
        'JOIN \"Person\" ON \"Person\".per_id = \"MoveLine\".person_id ' +
        'JOIN \"Desk\" ON \"Desk\".des_id = \"MoveLine\".\"toDesk\" ' +
        'WHERE \"MoveLine\".move_set_id = :conid '
        //and movings.formerOfficeOffId is not null
        , { replacements: { conid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (people) {
            res.json(people);
        });
}

/**
 * delete a configuration and every related moving
 */
const deleteMoveSet = (req, res) => { ///req : setid
    MoveLine.findAll({where:{move_set_id: req.params.setid}})
    .then(function(movelines){
        console.log(movelines);
        movelines.forEach(function(data,index){
            Desk.findOne({where:{des_id:data.toDesk}})
            .then(function(todesk){
                console.log(todesk)
                if (todesk.name=="aucun" || todesk.name=="externe"){
                    todesk.destroy()
                }
            })
            .then(function(){
                MoveLine.destroy({where:{mov_id:data.mov_id}})
            })
        });
    })
    .then(function () {
        MoveSet.destroy({
            where: {
                set_id: req.params.setid
            }
        });
    }).then(function () {
        console.log("OK !");
        req.flash('success', 'La configuration a &eacutet&eacute supprim&eacutee.');
        res.json("success");
    });
}

/**
 * if consistent (checked before service call)
 */
const validateMoveSet = (req, res) => {
    // change status from current validated conf to draft
    models.sequelize.query(
        'UPDATE \"MoveSet\" ' +
        'SET status_id = (SELECT sta_id FROM \"MoveStatus\" WHERE name = :sta ), ' +
        '\"dateUpdate\" = :date '+
        'WHERE set_id = :setid;'
        , { replacements: { date:new Date(),setid :req.body.setid, sta: "Validee"},
            type: models.sequelize.QueryTypes.UPDATE
    })
    .then(function (configuration) {
            MoveLine.findAll({where:{move_set_id: req.body.setid}})
            .then(function(movelines){
                movelines.forEach(function(data,index){
                    Desk.findOne({where:{des_id:data.fromDesk}})
                    .then(function(fromdesk){
                        if (fromdesk.name=="aucun" || fromdesk.name=="externe"){
                            fromdesk.destroy()
                        }else{
                            fromdesk.update({person_id :null})
                        }
                    })
                    Desk.findOne({where:{des_id:data.toDesk}})
                    .then(function(todesk){
                        todesk.update({person_id :data.person_id})
                    })
                    MoveLine.update({status:"moveline validé"},{where:{mov_id: data.mov_id}})
                });
            });
    }).then(function () {
        console.log("OK !");
        req.flash('success', 'La configuration a ete validee.');
        res.json("success");
    });

}

/**
 * get informations about all the movings of a configuration
 * start and arrival of the moving
 * people data
 * res : download .txt file
 */
const getMoveLineListByMoveSetId = (req, res) => {
    models.sequelize.query(
        'SELECT depart.name as from_desk, arrivee.name as to_desk, \"Person\".firstname, \"Person\".lastname, \"Person\".mail ' +
        'FROM \"MoveLine\" ' +
        'JOIN \"Person\" ON \"Person\".per_id = \"MoveLine\".person_id ' +
        'JOIN \"Desk\" as depart ON depart.des_id = \"MoveLine\".\"fromDesk\" ' +
        'JOIN \"Desk\" as arrivee ON arrivee.des_id = \"MoveLine\".\"toDesk\" ' +
        'WHERE \"MoveLine\".move_set_id = :setid '
        , { replacements: { setid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT})
       .then(function (person) {
            function createFile() {
                // write header in text file
                var header = "\ufeffPersonne \u00E0 d\u00E9placer" + " : \t\t" +
                    "Bureau de d\u00E9part" + " -> " + "Bureau d'arriv\u00E9e" + "\r\n";
                fs.appendFileSync('configuration-' + req.params.id + '.txt', header, 'utf8'
                );
                // write data lines
                person.forEach(function (elem) {
                     console.log(elem);
                    var text = elem.firstname + " " + elem.lastname + " : \t\t" +
                        elem.from_desk + " -> " + elem.to_desk + "\r\n";
                    fs.appendFileSync('configuration-' + req.params.id + '.txt',
                        text, 'utf8'
                    );
                });
            }
            // if a former file exists, delete it
            try {
                fs.accessSync('configuration-' + req.params.id + '.txt', fs.F_OK);
                fs.unlinkSync('configuration-' + req.params.id + '.txt', function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File deleted successfully!");
                });
                createFile();
            } catch(e) {
                console.log("No former configuration file.");
                createFile();
            }
            res.download('configuration-' + req.params.id + '.txt', 'configuration-' + req.params.id + '.txt',function (err) {
                if (err) {
                    console.log(err);
                    res.status(err.status).end();
                }
                else {
                    console.log('Sent : '+ 'configuration-' + req.params.id + '.txt');
                }
            });
       });

            
}

/**
 * add a new configuration with attributes name, creator, date
 * and link to copies of movings from the current configuration
 */
const addNewMoveSet = (req, res) =>{
    var names=req.body.creator.split(' ')
    var firstname='',lastname='';
    for (var i=0;i<names.length;i++){
        if (names[i]!=''){
            if (names[i]==names[i].toUpperCase()){
                lastname+=names[i]+" "
            }else{
                firstname+=names[i]+" "
            }
        }
    }
    firstname=firstname.substring(0,firstname.length-1)
    lastname=lastname.substring(0,lastname.length-1)
    MoveStatus.findOne({where:{name:"Brouillon"}})
    .then(function(status){
        Person.findOne({where:{firstname:firstname,lastname:lastname}})
        .then(function(creat){
            MoveSet.create({name:req.body.name, creator:req.body.creator, dateUpdate :new Date(), status_id :status.dataValues.sta_id,creator_id:creat.dataValues.per_id})
            .then(function(newset){
                res.redirect('/modify'+newset.dataValues.set_id);
            })
        })
    })
}

const getLastMoveSet =(req,res) =>{
    models.sequelize.query('SELECT set_id FROM \"MoveSet\" '+
    'ORDER BY "dateCreation" DESC '+
    'FETCH FIRST 1 ROWS ONLY; ',{replacements:{},type:models.sequelize.QueryTypes.SELECT})
}

const deleteMoveLine =(req,res) =>{
    models.sequelize.query(
        'DELETE FROM \"Desk\" '+
        'WHERE des_id IN (SELECT des_id FROM \"Desk\" '+
        'JOIN \"MoveLine\" ON \"MoveLine\".\"toDesk\"=\"Desk\".des_id '+
        'WHERE (\"Desk\".name= :auc OR \"Desk\".name= :ext) '+
        'AND \"MoveLine\".move_set_id= :confId '+
        'AND \"MoveLine\".person_id= (SELECT per_id FROM \"Person\" WHERE firstname= :firstname AND lastname= :lastname));'
    ,{replacements:{confId:req.body.confId,firstname:req.body.firstname,lastname:req.body.lastname, auc:"aucun",ext:"externe"},type :models.sequelize.QueryTypes.DELETE})

    models.sequelize.query(
        'DELETE FROM \"MoveLine\" '+
        'WHERE move_set_id= :confId '+
        'AND person_id= (SELECT per_id FROM \"Person\" WHERE firstname= :firstname AND lastname= :lastname);'
    ,{replacements:{confId:req.body.confId,firstname:req.body.firstname,lastname:req.body.lastname},type :models.sequelize.QueryTypes.DELETE})
    res.redirect('/');
}

const addMoveLine =(req,res) =>{
    var confId=req.body.confid;
    var fromLocation=req.body.fromdesk,
        toLocation=req.body.todesk;
    var fromDeskId=null,toDeskId=null;

    var fromSite=fromLocation.split(/\s*:\s*/)[0],
        fromDesk=fromLocation.split(/\s*:\s*/)[1];
    var toSite=toLocation.split(/\s*:\s*/)[0],
        toDesk=toLocation.split(/\s*:\s*/)[1];
    //find desks id
    Person.findOne({where:{firstname:req.body.firstname,lastname:req.body.lastname}})
    .then(function(person){
        Desk.findOne({where:{person_id:person.dataValues.per_id,name:fromDesk}})
            .then(function(from){
                    fromDeskId=from.dataValues.des_id;
            })
        .then(function(){
            Site.findOne({where:{name:toSite}})
            .then(function(tosite){
                if (toDesk!="aucun" && toDesk!="externe"){
                    Desk.findOrCreate({where:{name:toDesk,site_id:tosite.dataValues.sit_id},default:{name:toDesk, building :toDesk[0],floor:toDesk[1],site_id:tosite.dataValues.sit_id}})
                    .then(function(to){
                        if (to!=undefined && to!=null && to!=''){
                            toDeskId=to[0].dataValues.des_id;
                            MoveLine.create({dateCreation:new Date(),status:req.body.status, move_set_id: confId, person_id :person.dataValues.per_id, fromDesk:fromDeskId, toDesk:toDeskId})
                        }   
                    })
                }else{
                    Desk.create({name:toDesk, site_id:tosite.dataValues.sit_id})
                    .then(function(to){
                        if (to!=undefined && to!=null && to!=''){
                            toDeskId=to.dataValues.des_id; 
                            MoveLine.create({dateCreation:new Date(),status:req.body.status, move_set_id: confId, person_id :person.dataValues.per_id, fromDesk:fromDeskId, toDesk:toDeskId})
                        }
                    })            
                }
            })
        })   
    })
    res.redirect('/');
}

const deleteMoveLineIfFind = (req,res) =>{
    models.sequelize.query('SELECT count(*) FROM \"MoveLine\" WHERE move_set_id= :confId '+
        'AND person_id= (SELECT per_id FROM \"Person\" WHERE firstname= :firstname AND lastname= :lastname)'
    , { replacements: { confId:req.body.confid,firstname: req.body.firstname, lastname : req.body.lastname },type: models.sequelize.QueryTypes.SELECT})
    .then(function (resultat) {
        console.log(resultat[0].count)
        if (resultat[0].count>=1){
            
            models.sequelize.query(
            'DELETE FROM \"Desk\" '+
            'WHERE des_id IN (SELECT des_id FROM \"Desk\" '+
            'JOIN \"MoveLine\" ON \"MoveLine\".\"toDesk\"=\"Desk\".des_id '+
            'WHERE (\"Desk\".name= :auc OR \"Desk\".name= :ext) '+
            'AND \"MoveLine\".move_set_id= :confId '+
            'AND \"MoveLine\".person_id= (SELECT per_id FROM \"Person\" WHERE firstname= :firstname AND lastname= :lastname));'
            ,{replacements:{confId:req.body.confid,firstname:req.body.firstname,lastname:req.body.lastname, auc:"aucun",ext:"externe"},type :models.sequelize.QueryTypes.DELETE})

            models.sequelize.query(
            'DELETE FROM \"MoveLine\" '+
            'WHERE move_set_id= :confId '+
            'AND person_id= (SELECT per_id FROM \"Person\" WHERE firstname= :firstname AND lastname= :lastname);'
        ,{replacements:{confId:req.body.confid,firstname:req.body.firstname,lastname:req.body.lastname},type :models.sequelize.QueryTypes.DELETE})
        }
    }).then(function(){
    res.redirect('/');})

}

const updateDateMoveSet =(req,res) =>{
    models.sequelize.query(
        'UPDATE \"MoveSet\" SET \"dateUpdate\"= :date '+
        'WHERE set_id= :confId;'
    ,{replacements:{confId:req.params.confId,date: new Date()},type :models.sequelize.QueryTypes.UPDATE})
    res.redirect('/');
}

const checkFromDeskMoveline = (req,res) =>{
    var confid=req.params.confId;
    models.sequelize.query(
        'SELECT fromdesk.name as fromdesk, fromdesk.des_id as fromId, currentdesk.name as current, currentdesk.des_id as currentid, \"MoveLine\".mov_id as mov_id,\"Person\".firstname || \' \' || \"Person\".lastname as name FROM \"MoveLine\" '+
        'JOIN \"Desk\" as fromdesk ON fromdesk.des_id=\"MoveLine\".\"fromDesk\" '+
        'JOIN \"Desk\" as currentdesk ON currentdesk.person_id=\"MoveLine\".person_id '+
        'JOIN \"Person\" ON \"Person\".per_id =\"MoveLine\".person_id '+
        'WHERE fromdesk.des_id<>currentdesk.des_id '+
        'AND move_set_id= :setid ;',
        {replacements:{setid: confid},type: models.sequelize.QueryTypes.SELECT})
    .then(function(results){
            res.json(results)
    })
}

const checkToDeskMoveline = (req,res) =>{
    var setid=req.params.confId
    models.sequelize.query(
        'SELECT mov_id, todesk.des_id, todesk.name as todesk, \"Person\".firstname || \' \' || \"Person\".lastname as name, todesk.person_id,(SELECT person_id FROM \"MoveLine\" WHERE \"MoveLine\".\"fromDesk\"= todesk.des_id AND move_set_id= :setid LIMIT 1) as former  FROM \"MoveLine\" '+
        'JOIN \"Desk\" as todesk ON todesk.des_id=\"MoveLine\".\"toDesk\" '+
        'JOIN \"Person\" ON \"Person\".per_id =\"MoveLine\".person_id '+
        'WHERE todesk.person_id <>COALESCE((SELECT person_id FROM \"MoveLine\" WHERE \"MoveLine\".\"fromDesk\"= todesk.des_id AND move_set_id= :setid LIMIT 1),0) '+
        'AND move_set_id= :setid ;',
        {replacements:{setid: setid},type: models.sequelize.QueryTypes.SELECT})
        .then(function(results){
            res.json(results)
        })
}
const setInvalidMoveline = (req,res) =>{
    MoveLine.update({status:"Brouillon invalide"},{where:{mov_id:req.params.movid}})
    .then(function () {
        res.redirect('/')
    });
}

const isConfValid = (req,res) =>{
    models.sequelize.query(
        'SELECT count(*) FROM \"MoveLine\" WHERE status= :sta AND move_set_id= :setid;',
        {replacements:{setid:req.params.confId,sta:"Brouillon invalide"},type:models.sequelize.QueryTypes.SELECT}
    ).then(function(result){
        res.json(result)
    })
}

const getRecapOfMoveline = (req, res) => {
    models.sequelize.query(
        'SELECT sitedepart.name || :yt || depart.name as depart, sitearrivee.name || :yt || arrivee.name as arrivee, \"Person\".firstname, \"Person\".lastname, status ' +
        'from \"MoveLine\" ' +
        'join \"Person\" on \"Person\".per_id = \"MoveLine\".person_id ' +
        'LEFT JOIN \"Desk\" as depart on depart.des_id = \"MoveLine\".\"fromDesk\" ' +
        'LEFT JOIN \"Desk\" as arrivee on arrivee.des_id = \"MoveLine\".\"toDesk\" ' +
        'LEFT JOIN \"Site\" as sitedepart ON  sitedepart.sit_id = depart.site_id '+
        'LEFT JOIN \"Site\" as sitearrivee ON  sitearrivee.sit_id = arrivee.site_id '+
        'WHERE   \"MoveLine\".move_set_id = :setid '
        , { replacements: { yt: " : ", setid: req.params.id },
            type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (person) {
            res.json(person);
        });
}

const getNoPlacePersonByBusUnit = (req, res) => {
    models.sequelize.query(
        'SELECT \"Person\".firstname, \"Person\".lastname, \"BusinessUnit\".name AS businessunit, \"Company\".name AS company, "Person".mail AS mail '  +
        'FROM \"Person\" ' +
        'JOIN \"BusinessUnit\" ON \"BusinessUnit\".bus_id = \"Person\".\"businessUnit_id\" ' +
        'JOIN \"Company\" ON \"Company\".com_id = \"BusinessUnit\".company_id ' +
        'WHERE \"BusinessUnit\".bus_id = :busid and \"Company\".com_id = :comid and \"Person\".per_id NOT IN ' +
        '( SELECT \"Desk\".person_id FROM \"Desk\" WHERE \"Desk\".person_id = \"Person\".per_id );'
        , { replacements: { busid: req.params.busid, comid: req.params.comid}, type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (noplace) {
            res.json(noplace);
        });
}

const getNoPlacePersonByCompany = (req, res) => {
    models.sequelize.query(
        'SELECT "MoveLine"."dateCreation" AS date, "MoveLine".person_id, \"Person\".firstname, \"Person\".lastname, "BusinessUnit".name AS businessunit, "Company".name AS company, "Person".mail , "MoveLine".status as status '  +
        'FROM "Person" ' +
        'JOIN \"BusinessUnit\" ON \"BusinessUnit\".bus_id = \"Person\".\"businessUnit_id\" ' +
        'JOIN \"Company\" ON \"Company\".com_id = \"BusinessUnit\".company_id ' +
        'LEFT JOIN \"Desk\" ON \"Desk\".person_id = \"Person\".per_id ' +
        'LEFT JOIN "MoveLine" ON "MoveLine".person_id = \"Person\".per_id ' +
        'WHERE \"Company\".com_id = :comid AND \"Desk\".name = :aucun '+
        'ORDER BY per_id, date DESC'
        , { replacements: {comid: req.params.comid, aucun: "aucun"}, type: models.sequelize.QueryTypes.SELECT
        })
        .then(function (noplace) {
            res.json(noplace);
        });
}


module.exports = {
    getAllMoveSet,
    getMoveSetById,
    countAllMoveLineByMoveSetId,
    getPeopleMoveLineByMoveSetId ,
    deleteMoveSet,
    validateMoveSet,
    getMoveLineListByMoveSetId,
    addNewMoveSet,
    getLastMoveSet,
    deleteMoveLine,
    addMoveLine,
    getRecapOfMoveline,
    getNoPlacePersonByBusUnit,
    getNoPlacePersonByCompany,
    checkFromDeskMoveline,
    checkToDeskMoveline,
    updateDateMoveSet,
    setInvalidMoveline,
    isConfValid,
    deleteMoveLineIfFind  
}