/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Pole = sequelize.define("Pole", {
        pol_id: {type: DataTypes.UUIDV1, primaryKey: true},
        name: DataTypes.STRING
        }, {
        classMethods: {
            associate: function (models) {
                Pole.belongsTo(models.Company);
                Pole.hasMany(models.Person);
            }
        }
    });
    return Pole;
};
