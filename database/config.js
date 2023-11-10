const mongoose = require('mongoose');

const dbConnection = async() => {
    
    try {
        await mongoose.connect( process.env.MONGODB_CNN);
        console.log('Conexión establecida con la base de datos');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión a base de datos');
    }
}

module.exports = {
    dbConnection
}