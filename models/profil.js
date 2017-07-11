/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Profil = sequelize.define('Profil', {
        pro_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        isValidatorLvlOne: {type : DataTypes.BOOLEAN, defaultValue : false},
        isValidatorLvlTwo: {type : DataTypes.BOOLEAN, defaultValue : false},
        isAdministrator: {type : DataTypes.BOOLEAN, defaultValue : false}
    },{ tableName : 'Profil',freezeTableName: true,timestamps :false,     
        classMethods: {
            associate: function (models) {
                Profil.hasOne(models.Person, {as :"profil_id"});
            },
        }

    });
    return Profil;
};
