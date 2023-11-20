const { Router } = require('express');
const { login,resetPassword,resetPasswordVerificaToque,newResetPassword } = require('../controllers/AuthControllers');




const router = Router();

router.post('/login', login );
router.post('/resetpassword', resetPassword );
router.get('/resetpassword/:id', resetPasswordVerificaToque );
router.post('/newresetpassword', newResetPassword );

module.exports = router;