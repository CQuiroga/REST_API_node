const { Categoria, Producto, Role, Usuario } = require('../models');

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

        throw new Error( `Id: ${ id }, no encontrado!`);
    }
}

// Categorias

const existeCategoriaPorId = async( id ) => {

    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria ) {
        throw new Error(`Id: ${ id }, no encontrado!`);
    }
}

// Productos

const existeProductoPorId = async( id ) => {

    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

// Validar Colecciones

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const existeColeccion = colecciones.includes( coleccion )
    if (!existeColeccion) {
        throw new Error(`la colección ${ coleccion } no existe en el sistema, colecciones permitidas: ${ colecciones }`);
    }

    return true;
}


module.exports = {
    esRoleValido,
    esCorreoValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}