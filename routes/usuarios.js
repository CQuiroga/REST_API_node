const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar_campos');
const { esRoleValido, esCorreoValido, existeUsuarioPorId } = require('../helpers/db_validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch,
        usuariosGetById 
      } = require('../controllers/usuarios');

    const router = Router();

    router.get('/', usuariosGet);

    router.get('/:id', usuariosGetById);

    router.put('/:id', [
        check('id', 'ID no es válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom( esRoleValido ),
        validarCampos
        ], usuariosPut
    );

    router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña es obligatoria y debe contener más de 6 letras').isLength({ min: 6 }),
        check('correo', 'Correo no válido').isEmail(),
        check('correo').custom( esCorreoValido ),
        check('rol').custom( esRoleValido ),
        validarCampos
        ], usuariosPost
    );

    router.delete('/:id', [
        check('id', 'ID no es válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
        ], usuariosDelete
    );
    router.patch('/', usuariosPatch);

module.exports = router;