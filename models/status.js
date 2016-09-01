/**
 * Created by msalvi on 01/09/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Status = sequelize.define("Status", {
        stu_id: { type: DataTypes.UUIDV1, primaryKey: true},
        isValidatorLvlOne: DataTypes.BOOLEAN,
        isValidatorLvlTwo: DataTypes.BOOLEAN

    });
    return Status;
};
