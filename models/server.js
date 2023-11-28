const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {
    
    constructor() {
        
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            usuarios:   '/api/usuarios',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads',
        }
        this.middlewares();
        this.routes();
        // Establecer conexión a la base de datos
        this.conectarDB();
        
    }

    async conectarDB() {
        await dbConnection();
    }

    // Middlewares

    middlewares() {
        
        this.app.use( cors() );

        //Carpeta usada como servidor web
        this.app.use( express.static('public') );
        
        // recibir datos en el endpoint
        this.app.use( express.json() );

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    // Rutas

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor ejecutándose en: http://localhost:${this.port}`);
        })
    }
}

module.exports = Server;