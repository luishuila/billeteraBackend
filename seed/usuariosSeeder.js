const bcrypt = require('bcrypt');


const usuariosSeeder = [
  {
      nombre: 'admin',
      email: 'admin@admin.com',
      rol:'admin',
      password:bcrypt.hashSync('123456789', bcrypt.genSaltSync(10), null ) ,
      documento: 123456789,
      celular:"12345"
  },
  {
    nombre: 'users',
    email: 'users@users.com',
    rol:'users',
    password: bcrypt.hashSync('123456789', bcrypt.genSaltSync(10), null ),
    documento:1023456789,
    celular:"323345678"
  }
]


module.exports = usuariosSeeder
