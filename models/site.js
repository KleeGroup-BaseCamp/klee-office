"use strict";

module.exports = function(sequelize, DataTypes) {
    var Site = sequelize.define('Site', {
        sit_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name:   {type : DataTypes.STRING},
        adress: {type : DataTypes.STRING, allowNull :true}
    }, {tableName : 'Site',freezeTableName: true,timestamps :false,
        classMethods: {
            associate: function (models) {
                Site.hasMany(models.Desk);
            }
        }
    });
    return Site;
};
