/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Company = sequelize.define("Company", {
        com_id: { type: DataTypes.UUIDV1, primaryKey: true},
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Company.hasMany(models.Pole);
            }
        }
    });
    return Company;
};
