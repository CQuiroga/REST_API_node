const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto} = require('../models')

const cargarArchivo = async(req = request, res = response) => {

  try {
    const nombre =  await subirArchivo( req.files, undefined, 'imgs' );

    res.json({
    msg: `Archivo cargado correctamente! : ${ nombre }`});

  } catch (msg) {
      res.status(400).json({ msg })
  }
  
 
} 

// Subir archivo a cloudinary

const actualizarArchivo = async(req = request, res = response) => {

  const { coleccion, id } = req.params;

  let modelo;

  switch ( coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById ( id );
          if (!modelo) {
            return res.status(400).json({
              msg: `No existe usuario con el id: ${ id }`
            })
          }
    break;
    
    case 'productos':
      modelo = await Producto.findById ( id );
          if (!modelo) {
            return res.status(400).json({
              msg: `No existe producto con el id: ${ id }`
            })
          }
    break;
  
    default:
      return res.status(500).json({
        msg: 'Colección no válida'
      })
  }

  if (modelo.img) {
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if (fs.existsSync( pathImagen )) {
      fs.unlinkSync( pathImagen )
    }
  }

  const nombre =  await subirArchivo( req.files, undefined, coleccion );
  modelo.img = nombre;

  await modelo.save();
  res.status(200).json({
    msg: 'Imagen modificada correctamente!',
    modelo
  });
}

const actualizarArchivoCloudinary = async(req = request, res = response) => {

  const { coleccion, id } = req.params;

  let modelo;

  switch ( coleccion) {

    case 'usuarios':
      modelo = await Usuario.findById ( id );
          if ( !modelo ) {
            return res.status(400).json({
              msg: `No existe usuario con el id: ${ id }`
            })
          }
    break;
    
    case 'productos':
      modelo = await Producto.findById ( id );
          if (!modelo) {
            return res.status(400).json({
              msg: `No existe producto con el id: ${ id }`
            })
          }
    break;
  
    default:
      return res.status(500).json({
        msg: 'Colección no válida'
      })
  }

  if (modelo.img) {
    const nombreArr = modelo.img.split( '/' );
    const nombre = nombreArr[ nombreArr.length -1 ];
    const [ public_id ] = nombre.split( '.');
    await cloudinary.uploader.destroy( public_id );
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

  //const nombre =  await subirArchivo( req.files, undefined, coleccion );
  modelo.img = secure_url;

  await modelo.save();
  
  res.json({
    msg: 'Imagen modificada correctamente!',
    modelo
  });
}

const mostrarImagen = async (req = request, res = response) => {

  const { coleccion, id } = req.params;

  let modelo;

  switch ( coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById ( id );
          if (!modelo) {
            return res.status(400).json({
              msg: `No existe usuario con el id: ${ id }`
            })
          }
    break;
    
    case 'productos':
      modelo = await Producto.findById ( id );
          if (!modelo) {
            return res.status(400).json({
              msg: `No existe producto con el id: ${ id }`
            })
          }
    break;
  
    default:
      return res.status(500).json({
        msg: 'Colección no válida'
      })
  }

  if (modelo.img) {
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if (fs.existsSync( pathImagen )) {
        return res.sendFile( pathImagen );
    }
    else{
      const pathImageDefault = path.join( __dirname, '../uploads/no-image.jpg');
      return res.sendFile( pathImageDefault );
    }
  }

  /* res.status(200).json({
    msg: 'Falta tener imagen de relleno!',

  }) */

}


module.exports = {
    cargarArchivo,
    actualizarArchivo,
    actualizarArchivoCloudinary,
    mostrarImagen
}