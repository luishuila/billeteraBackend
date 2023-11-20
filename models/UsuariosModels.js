const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
const {db} = require('../config/db.js');



const Usuarios = db.define('usuario', {
    nombre: {
       type: DataTypes.STRING,
        allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg : 'Agrega un correo válido'}
      }, 
      unique :  {
        args: true,
        msg : 'Usuario ya registrado'
      },
    },
    documento: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique : true
    },
    celular:{
      type: DataTypes.STRING,
       allowNull: false,
       unique : true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty : {
            msg : 'El password no puede ir vacio'
        }
    }
    }, 
    rol: DataTypes.STRING,
    token : DataTypes.STRING, 
    expiraToken : DataTypes.DATE
}, {
      hooks: {
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash( usuario.password, salt);
        }
    },
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
})

Usuarios.prototype.verificarPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}


module.exports = Usuarios



