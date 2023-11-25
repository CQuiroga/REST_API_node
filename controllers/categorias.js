const { response, request } = require('express');
const { validationResult } = require('express-validator');

const { Categoria } = require('../models');

// Obtener categorías (todas), paginado con populate

const obtenerCategorias = async( req = request, res = response ) => {

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
    }

    const { limite = 5, desde = 0, hasta = 5, page = 1 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query ).limit( Number( limite ) )
        .skip( Number( desde ) )
        .populate('usuario' , 'nombre') // mostrar información de la relación, a modo de "Inner Join"
    ]);
    
    res.json( {
            msg: 'Categorías ok',
            total,
            categorias,
            page
        });
 }

// Obtener categoría (por id), populate

const obtenerCategoriaById = async(req = request, res = response ) => {

    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.status(200).json( {
        msg: 'Categoría encontrada!',
        categoria
    } );

}

const crearCategoria = async(req = request, res = response) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `Lo sentimos, la categoría ${ categoriaDB.nombre }, ya existe!`
        });
    } 

    // Generar data recibida a guardar
   
    const data = { nombre, 
        usuario: req.usuario._id 
    }

    const categoria = new Categoria( data );

    // Guardar data (crear categoría en DB)

    await categoria.save();
    

    res.status(200).json({
        msg: 'Categoría creada correctamente!',
        categoria
    });
}

// Actualizar Categoría

const actualizarCategoria = async(req = request, res = response) => {
    
    const { id } = req.params;
    
    const { _id, estado, usuario,  ...params } = req.body;

    params.nombre = params.nombre.toUpperCase();

    const categoria = await Categoria.findByIdAndUpdate( id, params, { new: true} ); // para envíar respuesta con datos actualizados

    res.status(200).json( {
        msg: 'Categoría actualizada correctamente!',
        categoria
    });

}

// Borrar Categoría (cambiar estado)

const borrarCategoria = async(req = request, res = response) => {
    
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true} );
    const usuarioAutenticado = req.usuario;

    res.status(200).json({
        msg: `Categoría con id ${ id }, ha sido borrada correctamente!`,
        categoria,
        usuarioAutenticado
    })
}


module.exports = {
    obtenerCategorias,
    obtenerCategoriaById,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}