'use strict'

const validator = require('validator');
const Team = require('../models/team');

const controller = {

    test: (req, res) => {
        return res.status(200).send({
            message: 'Test'
        });
    },

    save: (req, res) => {
        const params = req.body;
        try{
            var validate_team = !validator.isEmpty(params.team);
            var validate_PG = !validator.isEmpty(params.PG);
            var validate_PE = !validator.isEmpty(params.PE);
            var validate_PP = !validator.isEmpty(params.PP);
            var validate_GF = !validator.isEmpty(params.GF);
            var validate_GC = !validator.isEmpty(params.GC);

            // var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            });
        }

        if(validate_team && validate_PG && validate_PE && validate_PP && validate_GF && validate_GC){
            return res.status(200).send({
                team: params
            });
        }
    },

};

module.exports = controller;