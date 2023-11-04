const { response } = require('express');

const usuariosGet = (req, res = response) => {

        const {nombre = 'No registra', 
               nacionalidad = 'No registra', 
               nacimiento = '00-00-0000'} = req.query; //Cuando se pasan varios argumentos poar la URL
        res.json({
            msg: 'petición GET ok, variables recibidas:',
            nombre,
            nacionalidad,
            nacimiento
        });
};

const usuariosPost = (req, res = response) => {  
    const {nombre, edad } = req.body; // Cuando se envían datos como un JSON
    res.json({
            msg: 'petición post ok', 
            body: `datos recibidos: `,
            nombre,
            edad
        });
};

const usuariosPut = (req, res = response) => {

        const {nombre, edad } = req.body;
        const id = req.params.id; // Cuando se envía un parámetro específico por la URL
        res.json({
            msg: 'Actualización de usuario ok, data recibida:',
            id,
            nombre,
            edad
        });
    };



const usuariosDelete = (req, res = response) => {
        const id = req.params.id; // Cuando se envía un parámetro específico por la URL, ejemplo el id
        res.json({
            msg: `Usuario con id ${ id } Borrado correctamente!`
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