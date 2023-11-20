const {DataTypes} = require('sequelize');
const {db} = require('../config/db.js');


const Productos = db.define('producto', {
   nombre: {
     type: DataTypes.STRING,
     allowNull: false
   },  
   precio : {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    stock  : {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
    },
    nombreArchivo: {
      type: DataTypes.STRING,
    },
    nombreKeyArchivo:{
      type: DataTypes.STRING,
    }

})


module.exports = Productos
