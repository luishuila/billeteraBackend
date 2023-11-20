const nodemailer = require('nodemailer');
const enviaCodigoTemplate = require('../assets/template/enviaCodigo');
const resetPasswordTemplate = require('../assets/template/resetPassword');
require('dotenv').config({ path : '.env.example'});

const enviarCodigo = async (email,nombre, codigo) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });

  

  await transport.sendMail({
      from: 'Billetera  virtual',
      to: email,
      subject: 'Código de verificación válido',
      text: 'Código de verificación válido',
      html: enviaCodigoTemplate(nombre,codigo , `${process.env.URl_FRONTEND}/producto/paga/${codigo}`)
      
  })
}
const resetPasswordEmail = async (email,nombre, toque) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });

  

  await transport.sendMail({
      from: 'Billetera  virtual',
      to: email,
      subject: 'Retrabeces contraseña',
      text: 'Retrabeces contraseña',
      html: resetPasswordTemplate(nombre, `${process.env.URl_FRONTEND}/login/resetpassword/${toque}`)
      
  })
}

module.exports = {
  enviarCodigo,
  resetPasswordEmail
}
