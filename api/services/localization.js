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
    models.sequelize.query('SELECT desk.name, desk.des_id FROM Desk ' +
        'JOIN \"Person\" ON desk.person_id=person.per_id '+
        'WHERE person.firstname = :first AND person.lastname = :last',
    /*    'JOIN \"MoveLine\" as mov ON mov.toDesk = desk.des_id '+
        'JOIN \"MoveSet\" as set ON set.set_id = mov.move_set_id '+
        'JOIN \"Person\" as per ON per.per_id = mov.person_id ' +
        'JOIN \"MoveStatus\" ON set.status_id = movestatus.sta_id ' +
        'WHERE movestatus.name = \"Validee\" ' +
       // 'where conf.name = \'Configuration premiere\' ' +
        'AND per.firstname = :first AND per.lastname = :last',*/
        { replacements: {first: req.params.first, last: req.params.last}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(desk){
            console.log(desk)
           res.json(desk);
        });
}

const getCurrentDeskNamebyId = (req,res) => {
    models.sequelize.query('SELECT desk.name, desk.des_id FROM desk ' +
        'JOIN \"Person\" ON desk.person_id=person.per_id '+
        'WHERE person.per_id = :id',
       /* 'JOIN moveline as mov ON mov.toDesk = desk.des_id '+
        'JOIN moveset as set on set.set_id = mov.move_set_id '+
        'JOIN person as per on per.per_id = mov.person_id ' +
        'JOIN movestatus on set.status_id = movestatus.sta_id ' +
        'where movestatus.name = "Validee" ' +
            // 'where conf.name = \'Configuration premiere\' ' +
        'and per.per_id = :id',*/
        { replacements: {id: req.params.id}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(desk){
            console.log(desk)
            res.json(desk);
        });
}

const saveMyLocalization = (req, res) => {
    console.log('call of service to save my localization in DB');
    // debug
    console.log(req.body);
    if(req.body['desk-name'] === undefined || req.body['desk-name'] === null
    || req.body['desk-name'] === "" ){
        req.flash('error', 'Veuillez cliquer sur un bureau avant de valider.');
        res.redirect('/localization');
    }
    State.find({where: {
        name: "A valider"
    }}).then(
        function(status){
            var date = new Date();
            var set = MoveSet.build({
                name: "Nouvelle localisation pour " + req.body.firstname + " " + req.body.lastname + " " + date.toDateString(),
                creator: req.body.firstname + " " + req.body.lastname,
                status_id: movestatus.dataValues.sta_id,
                dateCreation: date.toDateString()
            });
            set.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                })
                .then(function(moveset){
                    Desk.findOrCreate({
                        where: {
                            name: req.body['desk-name']
                        }}).spread(function(desk){
                        var today= Date.now();
                        var desid = desk.dataValues.des_id;


                        var setId = moveset.dataValues.set_id;
                        var firstname = req.body.firstname;
                        var lastname = req.body.lastname;

                        // add all moveline from current configuration
                        models.sequelize.query(
                            'SELECT * FROM \"MoveSet\" ' +
                            'JOIN \"MoveStatus\" moveset.status_id = status_id ' +
                            'WHERE status.name = "Validee"'
                            , {
                                replacements: {},
                                type: models.sequelize.QueryTypes.SELECT
                            })
                            .then(function (moveset) {
                                console.log(MoveSet);
                                MoveLine.findAll({
                                    where: {
                                        move_set_id: moveset[0].set_id
                                    }
                                })
                                    .then(function (moveline) {
                                        moveline.forEach(function(elem){
                                            // copy all the moveline from current configuration
                                            // except the one which is modified here
                                            if (elem.toDesk.toString() !== offid.toString()){
                                                Moving.create({
                                                    toDesk: elem.toDesk,
                                                    OfficeOffId: elem.OfficeOffId,
                                                    PersonPerId: elem.PersonPerId,
                                                    ConfigurationConId: conId
                                                }).then(function (newMoveLine) {
//                                                    console.log(elem.toDesk.toString() + "-------"+ offid.toString());
                                                });
                                            }
                                        });
                                        // insert new moving
                                        models.sequelize.query(' INSERT INTO \"MoveLine\"(\'createdAt\', \'updatedAt\',' +
                                            ' \'move_set_id\', \'person_id\', \'fromDesk\',' +
                                            ' \'toDesk\') ' +
                                            'VALUES(:today, :today, :setId ,' +
                                            '(SELECT per_id FROM \"Person\" WHERE firstname= :firstname and lastname = :lastname), ' +
                                            'coalesce((SELECT toDesk from moveline where person_id = ' +
                                            '(select per_id from person where firstname= :firstname and lastname = :lastname) ' +
                                            'and fromDesk is null), (select desk.des_id from desk where desk.name ="aucun") ) ' +
                                            ', :desId, :desId) ',
                                            { replacements: { today: today, setId: setId, firstname: firstname, lastname: lastname, desId: desid }, type: models.sequelize.QueryTypes.INSERT}
                                        ).then(function(moveline){
                                                console.log(moveline)
                                            });
                                    });
                            });
                    });
                });
        });
   // Flash message + redirect
    req.flash('success', 'Votre changement de localisation a bien &eacutet&eacute transmis. Il doit maintenant etre valid&eacute par un manager');
    res.redirect('/');
};


module.exports = {
    saveMyLocalization,
    getCurrentDeskName,
    getCurrentDeskNamebyId
}