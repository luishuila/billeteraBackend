const path = require('path');
const {
  v4: uuidv4
} = require('uuid');
const Jimp = require("jimp")
const fs = require('fs').promises
const {eliminarDisco} = require('../util/eliminarArchivo')
const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

  return new Promise( (resolve, reject) => {




      const nombreCortado = files.name.split('.');
      const extension = nombreCortado[ nombreCortado.length - 1 ];

      const nombreOriginalImagen = files.name.split('.').shift();


      if ( !extensionesValidas.includes( extension ) ) {
          return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
      }
      const generaString = uuidv4() 
      const nombreTemp =  generaString+ '.' + extension;
    
      const uploadPathTemp  = path.join( __dirname, '../uploads/',`${ carpeta}/temp`, nombreTemp );
     
      const nombreArchivo = generaString + '.png';
      const uploadPaths = path.join( __dirname, '../uploads/', carpeta,nombreArchivo)
     

      files.mv(uploadPathTemp, (err) => {
          if (err) {
              reject(err);
          }
          Jimp.read(`${uploadPathTemp}`, (error, image) => {
            if (error) {
              console.log(error)
            } else {
              image.write(uploadPaths)
              eliminarDisco(uploadPathTemp)
              resolve( {url:uploadPaths, nombreArchivo,nombreOriginalImagen:nombreOriginalImagen+'.png'} );
            }
          })
         
      });

  });

}



module.exports = {
  subirArchivo
}