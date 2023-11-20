const { Router } = require('express');
const { cuentaPost ,consultaSaldo} = require('../controllers/cuentaControllers');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.post('/',[validarJWT], cuentaPost );
router.post('/saldo', consultaSaldo );

module.exports = router;

