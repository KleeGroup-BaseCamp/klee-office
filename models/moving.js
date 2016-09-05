/**
 * Created by msalvi on 01/09/2016.
 */


"use strict";

module.exports = function(sequelize, DataTypes) {
    var Moving = sequelize.define("Moving", {
        mov_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
    }, {
        classMethods: {
            associate: function (models) {
                Moving.belongsTo(models.Person);
                // two offices linked to one moving
                Moving.belongsTo(models.Office, {as: 'formerOffice'});
                Moving.belongsTo(models.Office, {as: 'newOffice'});
                Moving.belongsTo(models.Configuration);
            }
        }
    });
    return Moving;
};

