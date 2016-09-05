/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Office = sequelize.define("Office", {
        off_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Office.hasMany(models.Moving)
            }
        }
    });
    return Office;
};


