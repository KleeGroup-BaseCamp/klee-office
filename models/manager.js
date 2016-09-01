/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Manager = sequelize.define("Manager", {
        man_id: { type: DataTypes.UUIDV1, primaryKey: true},
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        mail: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Manager.belongsTo(models.Pole);
                Manager.belongsTo(models.Status)
            }
        }
    });
    return Manager;
};
