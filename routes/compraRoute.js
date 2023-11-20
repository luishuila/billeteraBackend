const { Router } = require('express');
const { compraPost,pagarProductoCodigo,pagarProductoToken } = require('../controllers/comprasControllers');

const router = Router();

router.post('/paga',pagarProductoCodigo)
router.get('/paga/:id', pagarProductoToken );
router.post('/', compraPost );

module.exports = router;

