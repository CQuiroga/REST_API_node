const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar_jwt");

const login = async(req, res = response) => {
    
    const { correo, password } = req.body;

    try {
        
        //Verificar si el email existe    
        const usuario = await Usuario.findOne( { correo });
        if ( !usuario ) {
            return res.status(400).json({
                msj: 'Usuario o contraseña no son correctos - Email: incorrecto'
            });
        }

        // Verificar si el usuario está activo

        if ( !usuario.estado ) {
            return res.status(400).json({
                msj: 'Usuario no encontrado - Estado: inactivo'
            });
        }

        // Verificar si la contraseña es correcta

        const valipaPassword = bcryptjs.compareSync( password, usuario.password );

        if ( !valipaPassword ) {
            return res.status(400).json({
                msj: 'Usuario o contraseña no son correctos - Contraseña: incorrecta'
            });
        }

        // si todo ok, generar JWT

        const token = await generarJWT( usuario.id );



        res.json({
            msg: 'Login correcto',
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msj: 'Solicitud fallida, verifica los datos enviados'
        })
    }
    
}

module.exports = {login};