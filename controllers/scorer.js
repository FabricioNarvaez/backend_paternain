'use strict'

const validator = require('validator');
const { scorerModel } = require('../models/team');

const controller = {
    getTeams: async (req, res) =>{
        try{
            const players = await scorerModel.find();

            return !players ?
                    res.status(400).send({
                    status: 'error',
                    message: 'No hay jugadores.'
                    }) :
                    res.status(200).send({
                    status: 'success',
                    players: players
                    });
        }catch(err){
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver jugador.',
                error: err
            })
        }
    }
}