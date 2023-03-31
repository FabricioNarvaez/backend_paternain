'use strict'

var mongoose = require('mongoose');
// var app = require('./app');
const port = 3900;
const database = 'paternain';
const url = `mongodb://localhost:27017/${database}`;

const options = {useNewUrlParser: true};


mongoose.Promise = global.Promise;
mongoose.connect(url, options)
    .then(()=>{
        console.log(`La conexión a la base de datos ${database} se ha realizado correctamente.`);
        
        // Crear servidor y ponerme a escuchar peticiones HTTP
        // app.listen(port, () => {
        //     console.log("Servidor corriendo en HTTP://localhost:" + port);
        // });
});