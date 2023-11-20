const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/UsuariosModels');


const buscarIdToken = async( req  ) => {

    const token = req.header('Authorization');

  
    if ( !token ) {
       return null
    }

    try {
         const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
         const usuario = await Usuario.findById( uid );

        if( !usuario ) {
          return null;
        }
   
  
       return uid;
      } catch (error) {
        return null;
    }

}




module.exports = {
  buscarIdToken
}