const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models')
const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];

const buscarCategorias = async( termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        const categoria = await Categoria.findById( termino ).populate('usuario', 'nombre');

        return res.json({ 
            resultado: (categoria) ? [categoria]: []
        })
    }

    const regexp = new RegExp( termino, 'i' );

    const buscaCategorias = await Categoria.find({
        $or: [{ nombre: regexp }],
        $and: [{ estado: true }]
    }).populate('usuario', 'nombre');

    res.json( {
        buscaCategorias
    });

}

const buscarProductos = async( termino = '', res = response) => {
    
    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        const producto = await Producto.findById( termino )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

        return res.json({ 
            resultado: (producto) ? [producto]: []
        })
    }

    const regexp = new RegExp( termino, 'i' );

    const buscaProductos = await Producto.find({
        $or: [{ nombre: regexp }, 
              { descripcion: regexp}, 
              { img: regexp}],
        $and: [{ estado: true }]
    }).populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

    res.json( {
        buscaProductos
    });

}

const buscarUsuarios = async( termino = '', res = response) => {
    
    const esMongoId = ObjectId.isValid( termino);

    if ( esMongoId ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            resultado: (usuario) ? [usuario]: []
        })
    }

    const regexp = new RegExp( termino, 'i' ); // Para manejo de expresiones regulares

    const buscaUsuarios = await Usuario.find({
        $or: [{ nombre: regexp }, { correo: regexp}], // Para validar por nombre ó por correo ó n....
        $and: [{ estado: true }]
    })

    res.json( {
        buscaUsuarios
    });
}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Colección no localizada, colecciones permitidas: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {

        case 'categorias':
            buscarCategorias( termino, res );
        break;

        case 'productos':
            buscarProductos( termino, res );
        break;

        case 'usuarios': 
            buscarUsuarios( termino, res );
        break;
    
        default:
            res.status(500).json({
                msg: 'Opción no disponible'
            })
    }

}

module.exports = {
    buscar
}