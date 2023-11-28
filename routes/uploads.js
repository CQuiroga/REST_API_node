const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validaArchivo } = require('../middlewares');
const { cargarArchivo, 
        actualizarArchivo, 
        mostrarImagen, 
        actualizarArchivoCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();

router.get('/:coleccion/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
], validarCampos, mostrarImagen);

router.post('/', validaArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validaArchivo,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
    ], 
    //actualizarArchivo
    actualizarArchivoCloudinary)

module.exports = router;