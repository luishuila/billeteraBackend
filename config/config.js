require('dotenv').config({ path : '.env.example'});






// config/config.js
module.exports = {
  development: {
    username:process.env.BD_USER,
    password:  process.env.BD_PASS,
    database: process.env.BD_NOMBRE,
    host:process.env.BD_HOST,
    dialect: 'mysql',
  },
  // Puedes tener configuraciones para otras fases, como "test" y "production".
};