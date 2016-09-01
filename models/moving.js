/**
 * Created by msalvi on 01/09/2016.
 */


"use strict";

module.exports = function(sequelize, DataTypes) {
    var Moving = sequelize.define("Moving", {
        mov_id: { type: DataTypes.UUIDV1, primaryKey: true}
    }, {
        classMethods: {
            associate: function (models) {
                Moving.belongsTo(models.Person);
                // two offices linked to one moving
                Moving.belongsToMany(models.Office, {through: 'MovingOffice'});
                Moving.belongsTo(models.Configuration);
            }
        }
    });
    return Moving;
};

