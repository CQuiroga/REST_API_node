const { response } = require('express');

const usuariosGet = (req, res = response) => {

        const {nombre = 'No registra', nacionalidad = 'No registra', nacimiento} = req.query;
        res.json({
            msg: 'petición GET ok, variables recibidas:',
            nombre,
            nacionalidad,
            nacimiento
        });
    };

const usuariosPut = (req, res = response) => {

        const id = req.params.id;
        res.json({
            msg: 'petición put ok, data recibida:',
            id
        });
    };

const usuariosPost = (req, res = response) => {
        
    const {nombre, edad } = req.body;
    
    res.json({
            msg: 'petición post ok', 
            body: 'datos recibidos:',
            nombre,
            edad
        });
    };

const usuariosDelete = (req, res = response) => {
        res.json({
            msg: 'petición delete ok'
        });
};

const usuariosPatch = (req, res = response) => {
        res.json({
            msg: 'petición patch ok'
        });
    }

module.exports = { usuariosGet, 
    usuariosPut, usuariosPost, 
    usuariosDelete, usuariosPatch};