
const {db} = require('../config/db.js');
const { exit} = require('node:process');
const usuariosSeeder = require('./usuariosSeeder.js');
const { Usuario, Productos } = require('../models/index.js');
const productosSeeder = require('./productosSeeder.js');

const importarDatos = async () => {
    try {
        // Autenticar 
        await db.authenticate()

        // Generar las Columnas
        await db.sync()
        
        // Insertamos los datos
        await Promise.all([
            Usuario.bulkCreate(usuariosSeeder),
            Productos.bulkCreate(productosSeeder)
        ])

        console.log('Datos Importados Correctamente')
         exit()
        
    } catch (error) {
        console.log(error)
         exit(1)
    }
}

const eliminarDatos = async () => {
    try {
        await db.sync()
        console.log('Datos Eliminados Correctamente');
         exit()
    } catch (error) {
        console.log(error)
         exit(1)
    }
}

if(process.argv[2] === "-i") {
    importarDatos();
}

if(process.argv[2] === "-e") {
    eliminarDatos();
}
