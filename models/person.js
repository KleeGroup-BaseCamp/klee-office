/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Person = sequelize.define("Person", {
        per_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        mail: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Person.belongsTo(models.Pole);
                Person.hasMany(models.Moving);
            }
        }
    });
    return Person;
};
