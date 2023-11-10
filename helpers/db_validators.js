const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') =>  {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${ rol } no existe en el sistema`);
    }
}

const esCorreoValido = async(correo = '') =>  {
    const existeCorreo = await Usuario.findOne( { correo })
    if ( existeCorreo ) {

        throw new Error( `El correo ${ correo } ya se encuentra en uso por otro usuario`);
    }
}

const existeUsuarioPorId = async( id ) =>  {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {

        throw new Error( `El id: ${ id } no existe`);
    }
}

module.exports = {
    esRoleValido,
    esCorreoValido,
    existeUsuarioPorId
}