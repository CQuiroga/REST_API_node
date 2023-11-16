const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {
    
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        //const { q, nombre, page = 1, limit } = req.query;

        //const usuarios = await Usuario.find(); // Para traer todos (similar a un select *)
        const { limite = 5, desde = 0, hasta = 6 } = req.query;
        const query = { estado: true };

        const [ total, usuarios ] = await Promise.all([
            Usuario.countDocuments( query ),
            Usuario.find( query ).limit(Number( limite )) // limitar a un número de resultados
            .skip(Number( desde ))
        ])

        res.json( {total, usuarios} );
};

const usuariosGetById = async(req, res = response) => {

    const { id } = req.params; // Cuando se envía un parámetro específico por la URL
    const usuario = await Usuario.findById( id );
    res.json( usuario);


};

const usuariosPost = async(req, res = response) => {  
    const { nombre, correo, password, rol } = req.body; // Cuando se envían datos como un JSON
    const usuario = new Usuario({ nombre, correo, password, rol });
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt );

    await usuario.save();

    res.json({
            status: 200,
            usuario
        });
};

const usuariosPut = async(req, res = response) => {

    const { id } = req.params; // Cuando se envía un parámetro específico por la URL
    const { _id, password, google, correo, ...resto } = req.body;

    // Validaciones
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto);
    
    res.json({
        msg: 'Actualización de usuario ok, data recibida:',
        usuario
    });    

};

const usuariosDelete = async(req, res = response) => {
        
    const { id } = req.params; // Cuando se envía un parámetro específico por la URL, ejemplo el id

    // Para borrar físicamente
    //const usuario = await Usuario.findByIdAndDelete( id );

    // Para cambiar de estado a 'inactivo'

    const usuario = await Usuario.findByIdAndUpdate( id, {estado:false});
    const usuarioAutenticado = req.usuario;

    res.json({
        msg: `Usuario con id ${ id }, ha sido borrado correctamente!`,
        usuario, 
        usuarioAutenticado
    });
};

const usuariosPatch = (req, res = response) => {
        res.json({
            msg: 'petición patch ok'
        });
    }

module.exports = { usuariosGet, 
                   usuariosPut, usuariosPost, 
                   usuariosDelete, usuariosPatch,
                   usuariosGetById
                 };