const fs = require('fs').promises


const eliminarDisco = (ruta) => {

  return new Promise( (resolve, reject) => {
    try {
      fs.unlink(ruta)
      resolve( "Se borro de disco " );
    } catch(err) {
      reject(err); 
    }
  });

}



module.exports = {
  eliminarDisco
}