/**
 * Created by msalvi on 06/09/2016.
 */

// models
var models = require('../../models');
var Person = models.Person;
var Desk = models.Desk;
var MoveSet = models.MoveSet;
var MoveLine = models.MoveLine;
var MoveStatus = models.MoveStatus;

/**
 * get the current office of a person
 * based on the current MoveSet
 */
const getCurrentDeskName = (req,res) =>{
    models.sequelize.query('SELECT \"Desk\".name , \"Desk\".des_id, "Site".name as site '+
        'FROM \"Desk\" ' +
       'JOIN \"Person\" ON \"Desk\".person_id=\"Person\".per_id '+
       'JOIN \"Site\" ON \"Site\".sit_id=\"Desk\".site_id '+
        'WHERE \"Person\".firstname = :first AND \"Person\".lastname = :last;',
        { replacements: {first: req.params.first, last: req.params.last}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(desk){
            console.log(desk)
           res.json(desk);
        });
}

const getCurrentDeskNamebyId = (req,res) => {
    models.sequelize.query('SELECT \"Desk\".name , \"Desk\".des_id '+
        'FROM \"Desk\" ' +
        'JOIN \"Person\" ON \"Desk\".person_id=\"Person\".per_id '+
        'WHERE \"Person\".per_id = :id',
        { replacements: {id: req.params.id}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(desk){
            console.log(desk)
            res.json(desk);
        });
}
const getOverOccupiedDesk =(req,res) => {
    models.sequelize.query('SELECT \"Desk\".name, \"Person\".firstname, \"Person\".lastname '+
    'FROM \"Desk\" '+
    'JOIN \"Person\" ON \"Desk\".person_id=\"Person\".per_id '+
    'WHERE name IN ('+
        'SELECT \"Desk\".name '+
        'FROM \"Desk\" ' +
        'WHERE \"Desk\".name<> :ext AND \"Desk\".name <> :none '+
        'GROUP BY \"Desk\".name HAVING COUNT(*)>1) '+
    'ORDER BY name',
        { replacements: {ext:'externe',none:'aucun'}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(desk){
            console.log(desk)
            res.json(desk);
    });
}

const saveMyLocalization = (req, res) => {
    console.log('call of service to save my localization in DB');

    var newDesk= req.body['desk-name']; 
    var newSite= req.body['site-name'];

    // debug
    if(newDesk === undefined || newDesk === null || newDesk === "" ){
            req.flash('error', 'Veuillez cliquer sur un bureau avant de valider.');
            res.redirect('/localization');
    }

    if (newSite=="La Boursidière"){
        Person.findOne({ where :{firstname : req.body.firstname,lastname : req.body.lastname}
        }).then(function(person_to_move){
            var perId=person_to_move.dataValues.per_id;
            var fromDeskId=null;
            var toDeskId;
            models.sequelize.query('SELECT "Desk".des_id, "Desk".name as desk, "Site".name as site ,"Desk".person_id FROM "Desk" '+
                        'JOIN "Site" ON "Site".sit_id="Desk".site_id '+
                        'WHERE person_id = :id ORDER BY "dateUpdate" DESC',
                        { replacements: {id: perId}, type: models.sequelize.QueryTypes.SELECT})
            .then(function(former_desk){
                // if a former desk exists it must be updated or destroyed
                if (former_desk[0]!==undefined){                    
                    fromDeskId=former_desk[0].des_id;
                    if (former_desk[0].site=="La Boursidière" && former_desk[0].desk!=="aucun"){
                        models.sequelize.query('UPDATE "Desk" '+
                            'SET person_id= null '+
                            'WHERE des_id = :desid',
                            { replacements: { desid: fromDeskId}, type: models.sequelize.QueryTypes.UPDATE})
                    }else {
                        Desk.findOne({where:{ des_id :fromDeskId}}).then(function(bidule){bidule.destroy()});
                        fromDeskId=null;
                    }
                }
            }).then(function(){ 

                Desk.findOrCreate({where: {name: newDesk}})
                .then(function(to_desk){ 
                    var former_person=to_desk[0].dataValues.person_id; //if not null, someone was at this place. A new new desk in la boursidère must be created and moveline ejection must be created at the end
                    toDeskId=to_desk[0].dataValues.des_id;
                    models.sequelize.query('UPDATE "Desk" '+
                            'SET floor= :fl , building= :build ,site_id= (SELECT sit_id FROM "Site" WHERE name= :site) , person_id= :perid '+
                            'WHERE des_id = :id',
                            { replacements: {fl:newDesk[1], build:newDesk[0], site: newSite, perid:perId, id: toDeskId}, type: models.sequelize.QueryTypes.UPDATE})
                    .then(function(){   
                        MoveStatus.findOne({where: {name: "Déplacement personnel"}})
                        .then(function(status){
                            var date = new Date();
                            var set = MoveSet.create({
                            name: "Nouvelle localisation pour " + req.body.firstname + " " + req.body.lastname + " " + date,
                            creator: req.body.firstname + " " + req.body.lastname,
                            status_id: status.sta_id,
                            dateCreation: date,
                            creator_id: perId})
                            .then(function (set) {  
                                 
                                if (to_desk.person_id !==null || to_desk.person_id !==undefined || to_desk.person_id !=="" ){
                                    models.sequelize.query('INSERT INTO "Desk"(name, "dateUpdate",site_id,person_id) VALUES '+
                                    '(:name , :dateupdate, (SELECT sit_id FROM "Site" WHERE name= :site) , :person_id);',
                                    { replacements: {name:"aucun",dateupdate:new Date(),person_id:former_person, site:newSite}, type: models.sequelize.QueryTypes.INSERT})
                                    MoveLine.create({dateCreation : new Date(), status :"ejection", person_id:former_person, fromDesk:to_desk[0].dataValues.des_id,toDesk:null, move_set_id:set.dataValues.set_id})
                                }
                                // insert new move line
                                MoveLine.create({
                                    status: "nouvelle localisation ",
                                    move_set_id: set.dataValues.set_id,
                                    status_id: status.sta_id,
                                    dateCreation: date,
                                    person_id: perId,
                                    fromDesk:fromDeskId,
                                    toDesk: toDeskId
                                }) 
                            })
                                
                        });
                    });
                })
            })
        })
    }
    else{
        Person.findOne({ where :{firstname : req.body.firstname,lastname : req.body.lastname}
        }).then(function(person_to_move){
            var perId=person_to_move.dataValues.per_id;
            var fromDeskId=null;
            var toDeskId;
            models.sequelize.query('SELECT "Desk".des_id,"Desk".name as desk, "Site".name as site  FROM "Desk" '+
                        'JOIN "Site" ON "Site".sit_id="Desk".site_id '+
                        'WHERE person_id = :id ORDER BY "dateUpdate" DESC',
                        { replacements: {id: perId}, type: models.sequelize.QueryTypes.SELECT})
            .then(function(former_desk){
                if (former_desk[0]!==undefined){
                    fromDeskId=former_desk[0].des_id;
                    if (former_desk[0].site==="La Boursidière" && former_desk[0].desk!=="aucun"){
                        models.sequelize.query('UPDATE "Desk" SET person_id= null '+
                            'WHERE des_id = :desid;',
                        { replacements: { desid: fromDeskId}, type: models.sequelize.QueryTypes.UPDATE})
                    }else {
                        Desk.findOne({where:{ des_id :fromDeskId}}).then(function(bidule){bidule.destroy()});
                        fromDeskId=null;
                    }
                }
            }).then(function(){   
                Desk.create({name: newDesk, person_id:perId})
                .then(function(to_desk){
                    toDeskId=to_desk.dataValues.des_id;
                    models.sequelize.query('UPDATE "Desk" '+
                            'SET site_id= (SELECT sit_id FROM "Site" WHERE name= :site) '+
                            'WHERE des_id = :id',
                            { replacements: {site : newSite, id: toDeskId}, type: models.sequelize.QueryTypes.UPDATE})
                    .then(function(){   
                        MoveStatus.findOne({where: {name: "Déplacement personnel"}})
                        .then(function(status){
                            var date = new Date();
                            var set = MoveSet.create({
                            name: "Nouvelle localisation pour " + req.body.firstname + " " + req.body.lastname + " " + date,
                            creator: req.body.firstname + " " + req.body.lastname,
                            status_id: status.sta_id,
                            dateCreation: date,
                            creator_id: perId})
                            .then(function (set) { 
                                // insert new moving
                                MoveLine.create({
                                    status: "my new position "+req.body.firstname+" "+req.body.lastname,
                                    move_set_id: set.dataValues.set_id, status_id: status.sta_id,
                                    dateCreation: date, person_id: perId,
                                    fromDesk:fromDeskId, toDesk: toDeskId
                                }) 
                            })
                                
                        });
                    });
                })
            })
        })
    }

   // Flash message + redirect
    req.flash('success', 'Votre changement de localisation a bien &eacutet&eacute transmis. Il doit maintenant etre valid&eacute par un manager');
    res.redirect('/');
};

const getLastDeskUpdate = (req,res) =>{
    models.sequelize.query('SELECT \"MoveLine\".\"dateCreation\" '+
        'FROM \"MoveLine\" '+
        'JOIN \"Person\" ON \"MoveLine\".person_id = \"Person\".per_id '+
        'WHERE \"Person\".per_id = :id ' +
        'ORDER BY \"MoveLine\".\"dateCreation\" desc ' +
        'LIMIT 1 ',
        { replacements: {id: req.params.id}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(updesk){
            console.log(updesk);
           res.json(updesk);
        });
}
const getPersonByDesk = (req,res) =>{
    console.log(req.params.name)
        models.sequelize.query('SELECT \"Person\".firstname,\"Person\".lastname '+
        'FROM \"Person\" '+
        'JOIN \"Desk\" ON \"Desk\".person_id = \"Person\".per_id '+
        'WHERE \"Desk\".name = :name ',
        { replacements: {name: req.params.name}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(person){
            console.log(person);
           res.json(person);
        });
}

/*const getLastDeskUpdate = (req,res) =>{
    models.sequelize.query('SELECT \"MoveLine\".\"dateCreation\" '+
        'FROM \"MoveLine\" M1 '+
        'WHERE NOT EXISTS ' +
            '(SELECT 1 ' +
            'FROM \"MoveLine\" M2 ' +
            'WHERE M2.mov_id = M1.mov_id ' +
            'AND M2.\"dateCreation\" > M2.\"dateCreation\" ',
        { replacements: {}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(updesk){
            console.log(updesk);
           res.json(updesk);
        });
}*/



module.exports = {
    saveMyLocalization,
    getCurrentDeskName,
    getCurrentDeskNamebyId,
    getLastDeskUpdate,
    getPersonByDesk,
    getOverOccupiedDesk
}