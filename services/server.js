const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
 const serveIndex = require('serve-index');
 const path = require('path');
 const {db} = require('../config/db.js');
 const soap = require('soap');

class Server {
  soapOptions; 
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      uploads: '/api/uploads',
      cuenta: '/api/cuenta',
      compra: '/api/compra',
      productos: '/api/productos',
    }


    // Conectar a base de datos
    this.conectarDB();

    // // Middlewares
    this.middlewares();

    // // Rutas de mi aplicación
    this.routes();
    //
    this.soap();
  }

  async conectarDB() {

    try {

      await db.authenticate()
      console.log('Conexión exitosa a la base de datos');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      throw new Error( error );
    }
  }


  middlewares() {
    const ruta = path.join( __dirname, '../uploads/');
    // CORS
    this.app.use(cors());

    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    this.app.use(express.json());

    this.app.use(express.static(__dirname + '/wsdl'));

    this.app.use( fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
      }));
  
  this.app.use('/uploads', express.static(ruta))
  this.app.use('/uploads', express.static('/'), serveIndex(ruta, {'icons': true}))

    

  }
   service = {
    MyService: {
      MyPort: {
        MyFunction: function (args) {
          return {
            result: 'Hola, ' + args.name + '!',
          };
        },
      },
    },
  };
  soap(){
   
  this.soapOptions = {
      path: '/wsdl',
      services: this.service,
      xml: '',
      wsdl_options: {
        attributesKey: 'attributes',
      }
    };
  }

  routes() {
    this.app.use( this.paths.auth, require('../routes/AuthRoute'));
    this.app.use(this.paths.usuarios, require('./../routes/UsuariosRoute'));
    this.app.use(this.paths.cuenta, require('./../routes/cuentaRoute'));
    this.app.use(this.paths.compra, require('./../routes/compraRoute.js'));
    this.app.use(this.paths.productos, require('./../routes/productoRoute'));
  }

  listen() {
    
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    });
  }

}




module.exports = Server;