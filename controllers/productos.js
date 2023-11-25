const { response, request } = require('express');
const { validationResult } = require('express-validator');

const {Producto, Usuario} = require('../models');

// Obtener todos los productos

const obtenerProductos = async(req = request, res = response) => {

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
    }

    const { limite = 5, desde = 0, hasta = 5, page = 1 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query ).limit( Number( limite ) )
        .skip( Number( desde ) )
        .populate('usuario' , 'nombre')
        .populate('categoria', 'nombre')
    ]);
    
    res.json( {
            msg: 'Productos ok',
            total,
            productos,
            page
        });


}

// Obtener producto por id

const obtenerProductoById = async(req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById( id )
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

    res.status(200).json( {
        msg: 'Producto encontrado!',
        producto
    } );

}

// Crear producto

const crearProducto = async( req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `Lo sentimos, el producto ${ productoDB.nombre }, ya existe`
        });
    }

    // Generar la data recibida a guardar

    const data = { ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id 
    }

    const producto = new Producto( data );

    // Guardar en db

    await producto.save();

    res.status(200).json({
        msg: 'Producto creado correctamente!',
        data
    });
}

// Actualizar producto

const actualizarProducto = async( req = request, res = response) => {
    
    const { id } = req.params;

    const { _id, estado, categoria, ...params} = req.body;

    params.nombre = params.nombre.toUpperCase();

    const producto = await Producto.findByIdAndUpdate( id, params, { new: true} )

    res.status(200).json({
        msg: 'Producto editado correctamente!',
        producto
    });

}

// Borrar producuto

const borrarProducto = async( req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id, { estado: false}, { new: true});
    const usuarioAutenticado = req.usuario;

    res.status(200).json({
        msg: `Producto con id ${ id }, ha sido borrado correctamente!`,
        producto,
        usuarioAutenticado
    })
}

module.exports = {
    obtenerProductos,
    obtenerProductoById,
    crearProducto,
    actualizarProducto,
    borrarProducto
}