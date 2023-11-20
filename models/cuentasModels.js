const {DataTypes,Sequelize} = require('sequelize');
const {db} = require('../config/db.js');


const Cuentas = db.define('cuenta', {
    saldo: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }

})


module.exports = Cuentas
