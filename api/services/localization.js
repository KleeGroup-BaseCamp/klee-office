/**
 * Created by msalvi on 06/09/2016.
 */

// models
var models = require('../../models');
var Person = models.Person;
var Office = models.Office;
var Configuration = models.Configuration;
var Moving = models.Moving;
var State = models.State;

/**
 * get the current office of a person
 * based on the current configuration
 */
const getCurrentOfficeName = (req,res) =>{
   // console.log(req.params);
    console.log(req.params);
   models.sequelize.query('SELECT offices.name, offices.off_id from offices ' +
        'join movings as mov on mov.newOfficeOffId = offices.off_id '+
        'join configurations as conf on conf.con_id = mov.ConfigurationConId '+
        'join people as peo on peo.per_id = mov.PersonPerId ' +
        'where conf.name = \'Configuration premiere\' ' +
        'and peo.firstname = :first and peo.lastname = :last',
        { replacements: {first: req.params.first, last: req.params.last}, type: models.sequelize.QueryTypes.SELECT}
    ).then(function(office){
            console.log(office)
           res.json(office);
        });
}

const saveMyLocalization = (req, res) => {
    console.log('call of service to save my localization in DB');
    // debug
    console.log(req.body);
    if(req.body['office-name'] === undefined || req.body['office-name'] === null
    || req.body['office-name'] === "" ){
        req.flash('error', 'Veuillez cliquer sur un bureau avant de valider.');
        res.redirect('/localization');
    }
    State.find({where: {
        name: "A valider"
    }}).then(
        function(state){
            var date = new Date();
            var conf = Configuration.build({
                name: "Nouvelle localisation pour " + req.body.firstname + " " + req.body.lastname + " " + date.toDateString(),
                creator: req.body.firstname + " " + req.body.lastname,
                StateStaId: state.dataValues.sta_id,
                dateCreation: date.toDateString()
            });
            conf.save()
                .error(function (err) {
                    console.log(err + " ---------" + elem);
                })
                .then(function(configuration){
                    Office.findOrCreate({
                        where: {
                            name: req.body['office-name']
                        }}).spread(function(office){
                        var today= Date.now();
                        var offid = office.dataValues.off_id;


                        var conId = configuration.dataValues.con_id;
                        var firstname = req.body.firstname;
                        var lastname = req.body.lastname;

                        models.sequelize.query(' INSERT into Movings(\'createdAt\', \'updatedAt\',' +
                            ' \'ConfigurationConId\', \'PersonPerId\', \'formerOfficeOffId\',' +
                            ' \'newOfficeOffId\', \'OfficeOffId\') ' +
                            'Values(:today, :today, :conId ,' +
                            '(select per_id from people where firstname= :firstname and lastname = :lastname), ' +
                            ':formerOffId' +
                            ', :offId, :offId) ',
                            { replacements: { today: today, conId: conId, firstname: firstname, lastname: lastname, formerOffId: req.body['former-office-id'], offId: offid }, type: models.sequelize.QueryTypes.INSERT}
                        ).then(function(moving){
                                console.log(moving)
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
    getCurrentOfficeName
}