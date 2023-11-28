

const dbValidators = require('./db_validators');
const generarJWT = require('./generar_jwt');
const googleVerify = require('./google_verify');
const subirArchivos = require('./subir_archivos');


module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivos
}
