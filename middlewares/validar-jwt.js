const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/UsuariosModels');


const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('Authorization');

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );


        const usuario = await Usuario.findOne(  {where : {id:uid }}   );

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }
   
        
        req.usuario = usuario;
        next();

    } catch (error) {

        res.status(401).json({
          error: 'Token no válido'
        })
    }

}




module.exports = {
    validarJWT
}