const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares');

const { esRoleValido, esCorreoValido, existeUsuarioPorId } = require('../helpers/db_validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch,
        obtenerUsuarioById,
      } = require('../controllers/usuarios');

    const router = Router();

    router.get('/', usuariosGet);

    router.get('/:id',[
        check('id', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos,
    ], obtenerUsuarioById );

    router.put('/:id', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
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
        check('rol').custom( esRoleValido, tieneRole ),
        validarCampos
        ], usuariosPost
    );

    router.delete('/:id', [
        validarJWT,
        esAdminRole,
        tieneRole( 'ADMIN_ROLE', 'USER_ROLE'),
        check('id', 'ID no es válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
        ], usuariosDelete
    );
    router.patch('/', usuariosPatch);

module.exports = router;