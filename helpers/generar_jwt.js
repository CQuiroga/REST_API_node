const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {
    
    return new Promise((resolve, reject) => {
        
        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Error al generar el Token')
            }
            else {
                resolve( token );
            }
        })
    });
}

module.exports = {
    generarJWT,
}