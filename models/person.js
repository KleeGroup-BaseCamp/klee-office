/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Person = sequelize.define("Person", {
        per_id: { type: DataTypes.UUIDV1, primaryKey: true},
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
