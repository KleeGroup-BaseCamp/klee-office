/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var BusinessUnit = sequelize.define('BusinessUnit', {
        bus_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name:   {type :DataTypes.STRING, allowNull : false}
        }, {tableName : 'BusinessUnit',freezeTableName: false,timestamps :false,
        classMethods: {
            associate: function (models) {
                BusinessUnit.belongsTo(models.Company, {foreignKey : 'company_id',targetKey:'com_id'});
                BusinessUnit.hasMany(models.Person);
            }
        }       
    });
    return BusinessUnit;
};
