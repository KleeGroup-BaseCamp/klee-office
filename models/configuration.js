/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Configuration = sequelize.define("Configuration", {
        con_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING,
        creator: DataTypes.STRING,
        dateCreation: DataTypes.DATE
    }, {
        classMethods: {
            associate: function (models) {
                Configuration.hasMany(models.Moving);
                Configuration.belongsTo(models.State);
            }
        }
    });
    return Configuration;
};
