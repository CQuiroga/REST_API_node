const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar_jwt");
const { googleVerify } = require("../helpers/google_verify");

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

const googleSignIn = async( req = request, res = response ) => {
    
    const { id_token } = req.body;

    try {
        
        const { nombre, correo, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne( { correo });

        // Si no hay usuario, crearlo en el backend
        
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: '💀💀💀💀💀💀💀',
                rol: "USER_ROLE",
                img,
                google: true
            };

            usuario = new Usuario( data ); 
            await usuario.save();
        };

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Este usuario ya se encuentra registrado, Estado: inactivo'
            })
        }

        // si todo ok, generar JWT

        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'id_token recibido correctamente!',
            usuario,
            token
        })


    } catch (error) {
        res.status(400).json({
            msg: 'No fue posible verificar el token, intentalo más tarde'
        })
    }

}

module.exports = { login, googleSignIn };