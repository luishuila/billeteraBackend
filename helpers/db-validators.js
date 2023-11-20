
const Usuario = require('../models/UsuariosModels');

const emailExiste = async( email = '' ) => {

  // Verificar si el correo existe
  const existeEmail = await Usuario.findOne({ email });

  if ( existeEmail ) {
   
      throw new Error(`El correo: ${ email }, ya está registrado 1`);
  }
}

module.exports = {emailExiste}