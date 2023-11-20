const {DataTypes} = require('sequelize');
const {db} = require('../config/db.js');


const Compras  = db.define('compra', {

    total : {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechaCompra : DataTypes.DATE,
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    }

},{
  paranoid: true,
})


module.exports = Compras
