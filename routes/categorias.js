const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole, tieneRole } = require('../middlewares');

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoriaById,
        actualizarCategoria,
        borrarCategoria} = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db_validators');
        

const router = Router();

// Obtener todas las categorías
router.get( '/', obtenerCategorias );

// Obtener una categoría por id
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoriaById );

// Crear una categoría
router.post('/', [ 
    validarJWT,
    check('nombre', 'Nombre de categoría es obligatorio').not().isEmpty(),
    validarCampos, 
    crearCategoria
]);

// Actualizar una categoría por id
router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);

// Eliminar una categoría por id
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    tieneRole( 'ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'ID no es válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);

module.exports = router;