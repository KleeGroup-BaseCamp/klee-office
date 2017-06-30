/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Desk = sequelize.define('Desk', {
        des_id:     {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name:       {type :DataTypes.STRING, allowNull : false},
        building :  {type :DataTypes.STRING, allowNull : true},
        floor :     {type :DataTypes.STRING, allowNull : true}
    }, {tableName : 'Desk',freezeTableName: true,timestamps :true,createdAt:false,updatedAt:'dateUpdate',
        classMethods: {
            associate: function (models) {
                Desk.hasMany(models.MoveLine);
                Desk.belongsTo(models.Site, {foreignKey: 'site_id',targetKey:'sit_id'});
                Desk.belongsTo(models.Person,{foreignKey:'person_id',targetKey :'per_id',allowNull:true})
            }
        }
    });
    return Desk;
};


