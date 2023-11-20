const {
  response
} = require('express');
const Usuario = require('../models/UsuariosModels');
const {
  generarJWT, generarId
} = require('../helpers/generar-jwt');
const { resetPasswordEmail } = require('../helpers/email');
const bcrypt = require('bcrypt');
const login = async (req, res = response) => {

  const {
    email,
    password
  } = req.body;

  try {

    // Verificar si el email existe
    const usuario = await Usuario.findOne({
      where:{email:email}
    });


    if (!usuario) {
      return res.status(400).json({
        error: 'Usuario / Password no son correctos - correo'
      });
    }


    const validPassword = await usuario.verificarPassword(password)
    if (!validPassword) {
      return res.status(400).json({
        error: 'Usuario / Password no son correctos - password'
      });
    }

    const token = await generarJWT(usuario.id);

    return res.json({
      usuario,
      token
    })

  } catch (error) {
    res.status(500).json({
      error: 'Hable con el administrador'
    });
  }

}
const resetPassword = async (req, res) => {
  try {
    const {
      documento
    } = req.body;
    const usuario = await Usuario.findOne({
      where : {documento:documento }  
    });
    
    if (!usuario) {
      return res.status(400).json({
        error: `El numero de documento ${ usuario.documento } no  encuetra  registrado`
      });
    }
    usuario.update({token:null,expiraToken:null  })


    let fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() + 1);
    const toque = generarId();
    usuario.update({token:toque,expiraToken:fechaActual  })
  
     await resetPasswordEmail(usuario.email,usuario.nombre,toque )

    return res.json({
      msg: `Hola ${usuario.nombre} se envie un toque de verificación al siguiente correo  para retrabeces tu contraseña  ${usuario.email}`
    });
  } catch (msg) {
    res.status(400).json({
      msg: "Fallo",
      error: msg
    });
  }
}

const resetPasswordVerificaToque = async (req, res) => {
  try {

    const usuario = await Usuario.findOne({
      where : {token: req.params.id }  
    });
    

    if (!usuario && contado != 4) {
      return res.status(400).json({
        msg: `toque expiró fallo`
      });
    }
    if (usuario){
      let fechaActual = new Date();
      if(fechaActual.getTime()>usuario.expiraToken.getTime()&& contado != 4){
        return res.status(400).json({
          msg: `toque expiró fallo`
        });
      }
    }


    return res.json({
      msg: `Éxito `,
      data:usuario
    });
  } catch (msg) {
    res.status(400).json({
      msg: "Fallo",
      error: msg
    });
  }
}


const newResetPassword = async (req, res) => {
  try {
    const {
      token,
      password
    } = req.body;
    const usuario = await Usuario.findOne({
      where : {token: token }  
    });
    

    if (!usuario && contado != 4) {
      return res.status(400).json({
        msg: `toque expiró fallo`
      });
    }
    if (usuario){
      let fechaActual = new Date();
      if(fechaActual.getTime()>usuario.expiraToken.getTime()&& contado != 4){
        return res.status(400).json({
          msg: `toque expiró fallo`
        });
      }
    }
    usuario.update({token:null,expiraToken:null,password:bcrypt.hashSync(password, bcrypt.genSaltSync(10), null )   })

    return res.json({
      msg: `Éxito `,
      usuario:usuario
    });
  } catch (msg) {
    res.status(400).json({
      msg: "Fallo",
      error: msg
    });
  }
}
module.exports = {
  login,
  resetPassword,
  resetPasswordVerificaToque,
  newResetPassword
}