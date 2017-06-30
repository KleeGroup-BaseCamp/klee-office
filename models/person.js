/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    const Person = sequelize.define('Person', {
        per_id:         {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        firstname:      {type : DataTypes.STRING, allowNull :false},
        lastname:       {type : DataTypes.STRING, allowNull:false},
        mail:           {type :DataTypes.STRING, allowNull: true},
    }, {tableName : 'Person',freezeTableName: true,timestamps :true,createdAt:false,updatedAt:'updatedAt',
        classMethods: {
            associate: function (models) {
                Person.belongsTo(models.BusinessUnit, {foreignKey:"businessUnit_id", targetKey:'bus_id'});
                Person.belongsTo(models.Profil, {foreignKey: 'profil_id',targetKey:'pro_id'});
                Person.hasMany(models.MoveLine);
            }
        },
    });
    return Person;
};
