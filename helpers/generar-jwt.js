const jwt = require('jsonwebtoken');
require('dotenv').config({ path : '.env.example'});



const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) => {
            if ( err ) {

                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}


const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32) ;


module.exports = {
    generarJWT,
    generarId
}

