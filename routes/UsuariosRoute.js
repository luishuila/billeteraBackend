
const { Router } = require('express');
const { usuariosPost, usuariosGet,usuariosDelete } = require('../controllers/UsuariosControllers');
const { validarJWT } = require('../middlewares/validar-jwt');
const { emailExiste } = require('../helpers/db-validators');
const { check } = require('express-validator');

const router = Router();

router.get('/',[validarJWT], usuariosGet );
 router.post('/',[    
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
 check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
 check('email', 'El correo no es válido').isEmail(),
 check('email').custom( emailExiste )
], usuariosPost );
 router.delete('/:id',[validarJWT],usuariosDelete  );

module.exports = router;