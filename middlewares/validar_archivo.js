const { request, response } = require("express");

const validaArchivo = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No se recibió archivo a subir!'
        });
      }

      next();

}

module.exports = {
    validaArchivo,
}