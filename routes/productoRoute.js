const { Router } = require('express');
const { listaProductos,buscarProducto,guardaProducto,eliminarProducto} = require('../controllers/ProductosControllers');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.post('/', guardaProducto );
router.get('/:id', buscarProducto );
router.get('/', listaProductos );
router.delete('/:id',[validarJWT], eliminarProducto );
module.exports = router;

