'use strict'

// const validator = require('validator');
const { matchWeeksModel } = require('../models/matchweeks');
const { TeamModelA, TeamModelB } = require('../models/team');

const controller = {
    getMatchWeeks: async (req, res) =>{
        try{
            const matchWeeks = await matchWeeksModel.find();

            return !matchWeeks ?
                    res.status(400).send({
                    status: 'error',
                    message: 'No hay jornadas.'
                    }) :
                    res.status(200).send({
                    status: 'success',
                    matchWeeks: matchWeeks
                    });
        }catch(err){
            console.log(err);
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver jornadas.',
                error: err
            })
        }
    }
}

module.exports = controller;