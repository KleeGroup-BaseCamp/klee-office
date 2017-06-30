/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var MoveStatus = sequelize.define('MoveStatus', {
        sta_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name:   {type : DataTypes.STRING},
    },{tableName : 'MoveStatus',freezeTableName: true,timestamps :false,
    classMethods :{
        associate : function(models){
            MoveStatus.hasMany(models.MoveSet)
        }
    }
    });
    return MoveStatus;
};
