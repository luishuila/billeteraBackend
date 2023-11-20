const {db} = require('../config/db.js');

const Usuario = require('./UsuariosModels');
const Cuentas = require('./cuentasModels.js')
const Transacciones = require('./transaccionesModels.js')
const Productos = require('./productosModels.js')
const Compras = require('./compraModels.js')
const DetallesCompra = require('./detallesCompra.js')

Usuario.hasOne(Cuentas);
Usuario.hasMany(Productos);
Usuario.hasMany(Compras);

Productos.hasMany(DetallesCompra);
Compras.hasOne(DetallesCompra);

Cuentas.hasMany(Transacciones);



db.sync().then(() => console.log('DB Conectada')).catch((error) => console.log(error));


module.exports = {
  Usuario,
  Cuentas,
  Transacciones,
  Productos,
  Compras,
  DetallesCompra,
  sqlQuery:db
}