const bcrypt = require('bcrypt');


const usuariosSeeder = [
  {
      nombre: 'admin',
      email: 'admin@admin.com',
      rol:'admin',
      password:bcrypt.hashSync('123456789', bcrypt.genSaltSync(10), null ) ,
      documento: 123456,
      celular:"12345"
  },
  {
    nombre: 'batman',
    email: 'huila457@gmail.com',
    rol:'users',
    password: bcrypt.hashSync('123456789', bcrypt.genSaltSync(10), null ),
    documento:10234567,
    celular:"323345678"
  }
]


module.exports = usuariosSeeder
