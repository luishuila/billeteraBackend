
const {DataTypes} = require('sequelize');
const {db} = require('../config/db.js');

const DetallesCompra  = db.define('DetallesCompra', {

  precioUnitario : {
      type: DataTypes.DECIMAL,
      allowNull: false
  },
  cantidad  : {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total : {
    type: DataTypes.DECIMAL,
    allowNull: false
  },  
  pendiente :{
    type: DataTypes.STRING,
    allowNull: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  }

},{
  paranoid: true,
})


module.exports = DetallesCompra