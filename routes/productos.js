const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole, tieneRole } = require('../middlewares');
const { crearProducto, 
        obtenerProductos, 
        obtenerProductoById, 
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos');
const { existeProductoPorId } = require('../helpers/db_validators');


const router = Router();

// Obtener todos los productos
router.get( '/', obtenerProductos );

// Obtener un producto por id
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProductoById );

// Crear un producto
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    validarCampos
], crearProducto);

// Editar un producto

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

// Eliminar un producto

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    tieneRole( 'ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'ID no es válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
], borrarProducto)

module.exports = router;