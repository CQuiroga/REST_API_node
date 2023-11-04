const express = require('express');
const cors = require('cors');

class Server {
    
    constructor() {
        
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.middlewares();
        this.routes();
        
    }

    // Middlewares

    middlewares() {
        
        this.app.use( cors() );
        
        this.app.use( express.static('public') );
    
        // recibir datos en el endpoint
        
        this.app.use( express.json() );


    }

    // Rutas

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor ejecutándose en: http://localhost:${this.port}`);
        })
    }
}

module.exports = Server;