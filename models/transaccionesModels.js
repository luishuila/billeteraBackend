const {DataTypes} = require('sequelize');
const {db} = require('../config/db.js');



const Transacciones = db.define('transacciones', {
    monto : {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    tipoTransaccion : {
      type: DataTypes.STRING,
       allowNull: false
    },
    token :{ 
      type:DataTypes.STRING(6)
    }, 
    pendiente :{
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaVencimiento: DataTypes.DATE,
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    }

},{
  paranoid: true,
})


module.exports = Transacciones