/**
 * Created by msalvi on 01/09/2016.
 */


"use strict";

module.exports = function(sequelize, DataTypes) {
    var MoveLine = sequelize.define('MoveLine', {
        mov_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        status : {type : DataTypes.STRING, allowNull:true}
    }, {tableName : 'MoveLine',freezeTableName: true,timestamps :true,createdAt:'dateCreation',updatedAt:false,
        classMethods: {
            associate: function (models) {
                MoveLine.belongsTo(models.MoveSet, {foreignKey: 'move_set_id',targetKey:'set_id'});
                MoveLine.belongsTo(models.Person, {foreignKey: 'person_id',targetKey:'per_id'});
                // two offices linked to one moving
                MoveLine.belongsTo(models.Desk, {as : 'former' ,foreignKey:'fromDesk',targetKey:'des_id'});
                MoveLine.belongsTo(models.Desk, {as :'new',foreignKey:'toDesk',targetKey:'des_id'});
            }
        }
    });
    return MoveLine;
};

