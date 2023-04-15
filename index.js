'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const database = 'paternain';
const url = `mongodb://localhost:27017/${database}`;
const options = {useNewUrlParser: true};

mongoose.Promise = global.Promise;
mongoose.connect(url, options)
    .then(()=>{
        console.log(`La conexión a la base de datos ${database} se ha realizado correctamente.`);

        app.set('port', process.env.PORT || 3000);
        
        app.listen(app.get('port'), () => {
            console.log(`Servidor corriendo en el puerto: ${app.get('port')}`);
        });
    })
    .catch((err) => {
        console.log(`Error al conectar a la base de datos ${database}.`);
        console.log(err);
    });