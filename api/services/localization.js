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

const saveMyLocalization = (req, res) => {
    console.log('call of service to save my localization in DB');
    // debug
    console.log(req.body);
    State.find({where: {
        name: "A valider"
    }}).then(
        function(state){
            var conf = Configuration.build({
                name: req.body.firstname + " " + req.body.lastname,
                creator: req.body.firstname + " " + req.body.lastname,
                StateStaId: state.dataValues.sta_id,
                date: Date.now()
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
                            '(select newOfficeOffId from movings where PersonPerId = ' +
                            '(select per_id from people where firstname= :firstname and lastname = :lastname) ' +
                            'and formerOfficeOffId is null)' +
                            ', :offId, :offId) ',
                            { replacements: { today: today, conId: conId, firstname: firstname, lastname: lastname, offId: offid }, type: models.sequelize.QueryTypes.INSERT}
                        ).then(function(moving){
                                console.log(moving)
                            });
                    });
                });
        });
   // needs improvement with error or success message before redirecting
    res.redirect('/');
};


module.exports = {
    saveMyLocalization
}