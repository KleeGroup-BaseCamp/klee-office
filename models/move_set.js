/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var MoveSet = sequelize.define('MoveSet', {
        set_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name:   {type : DataTypes.STRING, allowNull : false},
        creator: {type : DataTypes.STRING},
    }, {tableName : 'MoveSet',freezeTableName: true,timestamps :true,createdAt:'dateCreation',updatedAt:'dateUpdate',
        classMethods: {
            associate: function (models) {
                MoveSet.hasMany(models.MoveLine);
                MoveSet.belongsTo(models.MoveStatus, {foreignKey :'status_id', targetKey : 'sta_id'});
                MoveSet.belongsTo(models.Person, {foreignKey : {name:'creator_id' , allowNull :true},targetKey : 'per_id'});
            }
        }
    });
    return MoveSet;
};
