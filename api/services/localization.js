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
    models.sequelize.query('SELECT \"Desk\".name , \"Desk\".des_id '+
        'FROM \"Desk\" ' +
       'JOIN \"Person\" ON \"Desk\".person_id=\"Person\".per_id '+
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

const saveMyLocalization = (req, res) => {
        
    console.log('call of service to save my localization in DB');
    // debug
    //console.log(req.body);
    var newDesk= req.body['desk-name']; 
    if(newDesk === undefined || newDesk === null || newDesk === "" ){
        req.flash('error', 'Veuillez cliquer sur un bureau avant de valider.');
        res.redirect('/localization');
    }
    Person.findOne({
        where :{firstname : req.body.firstname,lastname : req.body.lastname}
    }).then(function(person_to_move){
            var perId=person_to_move.dataValues.per_id;
            var fromDeskId;
            var toDeskId;
            Desk.findOne({where: person_id=perId})
                .then(function(former_desk){
                    former_desk.update({person_id:null});
                    
                    console.log("!!!!!!!!!!!!!!!!!! former desk !!!!!!!!!!!!!!!!!!")
                    console.log(former_desk)
                    fromDeskId=former_desk.des_id;
                    console.log(fromDeskId)
                })
            Desk.findOrCreate({where: {name: newDesk}})
                .then(function(to_desk){
                    var build="";
                    if (to_desk[0].dataValues.name[0]=="N"){
                        build="Normandie";
                    }else if (build[0].dataValues.name[0]=="O"){
                        build="Orléans";
                    }
                    toDeskId=to_desk[0].dataValues.des_id;

                    models.sequelize.query('UPDATE "Desk" '+
                        'SET floor= :fl , building= :build ,site_id= :site , person_id= :perid '+
                        'WHERE des_id = :id',
                        { replacements: {fl:newDesk[1], build:build, site: 1, perid:perId, id: toDeskId}, type: models.sequelize.QueryTypes.UPDATE})
                    console.log("!!!!!!!!!!!!!!!!!! new desk !!!!!!!!!!!!!!!!!!")
                    console.log(to_desk);    
                    console.log("!!!!!!!!!!!!!!!! " +toDeskId+"     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                });
            MoveStatus.findOne({where: {name: "Déplacement personnel"}})
                .then(function(status){
                    console.log("let's build a new moveset ")
                    var date = new Date();
                    var set = MoveSet.build({
                        name: "Nouvelle localisation pour " + req.body.firstname + " " + req.body.lastname + " " + date,
                        creator: req.body.firstname + " " + req.body.lastname,
                        status_id: status.sta_id,
                        dateCreation: date,
                        creator_id: perId})
                    .save()
                    .error(function (err) {
                        console.log(err + " ---------" + elem);
                    })
                    .then(function(moveset){
                        console.log("!!!!!!!!!!!!!!!! " +moveset+"     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        console.log(moveset);
                        var today= new Date();
                        var setId = moveset.set_id;
                        // add all moveline from current configuration
                        models.sequelize.query(
                            'SELECT * FROM \"MoveSet\" ' +
                            'JOIN \"MoveStatus\" ON \"MoveSet\".status_id = \"MoveStatus\".sta_id ' +
                            'WHERE \"MoveStatus\".name <> :status '+
                            'ORDER BY "MoveSet"."dateCreation" DESC'
                            , {replacements: {setid:setId, status:"Brouillon"},type: models.sequelize.QueryTypes.SELECT
                        }).then(function (last_moveset) {
                                console.log("last moveset")
                                console.log(last_moveset);
                                MoveLine.findAll({
                                    where: {move_set_id: last_moveset[0].set_id}
                                }).then(function (last_movelines) {
                                        last_movelines.forEach(function(elem){
                                            // copy all the moveline from current configuration
                                            // except the one which is modified here
                                            if (elem.toDesk.toString() !== toDeskId.toString() && elem.person_id.toString()!==person_to_move.per_id.toString()){
                                                MoveLine.create({
                                                    toDesk: elem.toDesk,
                                                    dateCreation : Date.now(),
                                                    status :"no change",
                                                    fromDesk: elem.toDesk,
                                                    person_id: elem.PersonPerId,
                                                    move_set_id: setId
                                                }).then(function (newMoveLine) {
                                                    console.log(elem.toDesk.toString() + "-------"+ offid.toString());
                                                });
                                            }
                                        });
                                });
                                        // insert new moving
                                        console.log("my moveline");
                                models.sequelize.query(' INSERT INTO \"MoveLine\"("status", \"dateCreation\",\"move_set_id\", \"person_id\", \"fromDesk\",\"toDesk\") ' +
                                    'VALUES(:status, :today,:setId ,:perid, :fromdeskid, :todeskid) ',
                                    {replacements: { status: "my new position",today :today, setId: setId, perid : perId, fromdeskid:fromDeskId, todeskid: toDeskId }, type: models.sequelize.QueryTypes.INSERT}
                                ).then(function(moveline){
                                            console.log(moveline)
                                });
                        });
                    });
                });
        });
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
    getPersonByDesk
}