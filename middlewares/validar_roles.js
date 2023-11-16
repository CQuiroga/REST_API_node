const { request, response } = require("express");


const esAdminRole = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere validar el role del usuario primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        res.status(401).json({
            msg: `El usuario ${nombre}, no tiene permisos para realizar esta acción - No es administrador`
        })
    }
    next();
}

const tieneRole = ( ...role ) => {
    return ( req = request, res = response, next ) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se requiere validar el role del usuario primero'
            });
        }

        if (!role.includes( req.usuario.rol)) {
            return res.status(401).json({
                msg: `Se requiere almenos uno de estos roles: ${ role }`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}