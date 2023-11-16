const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    
    const token = req.header('x-token'); // Cuando se envían datos en el header de la solicitud

    if (!token) {
        return res.status(401).json({
            msg: 'No hay Token'
        })
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );

        // Verificar el estado del usuario antes de eliminar

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Acción inválida - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Acción inválida - usuario logueado está inactivo'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msj: 'El Token recibido no es correcto'
        })
    }
}

module.exports = {
    validarJWT
}