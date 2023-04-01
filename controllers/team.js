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
        
        const validate_team = !validator.isEmpty(params.team);
        const validate_PG = !validator.isEmpty(params.PG);
        const validate_PE = !validator.isEmpty(params.PE);
        const validate_PP = !validator.isEmpty(params.PP);
        const validate_GF = !validator.isEmpty(params.GF);
        const validate_GC = !validator.isEmpty(params.GC);

        if(validate_team && validate_PG && validate_PE && validate_PP && validate_GF && validate_GC){
            const team = new Team();

            team.team = params.team;
            team.PG = params.PG;
            team.PE = params.PE;
            team.PP = params.PP;
            team.GF = params.GF;
            team.GC = params.GC;

            team.save()
            .then((teamStored) => {
                return !teamStored ?
                    res.status(400).send({
                        status: 'error',
                        message: 'El equipo no se ha guardado.'
                    }) :
                    res.status(201).send({
                        status: 'Created',
                        team: teamStored
                    });
            })
            .catch((err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al guardar el equipo.',
                    error: err
                });
            });
        }else{
            return res.status(400).send({
                status: 'error',
                message: 'Los datos no son válidos.'
            });
        }
    },
    getTeams: (req, res) => {
        Team.find()
        .then((teams) => {
            return !teams ?
                res.status(400).send({
                    status: 'error',
                    message: 'No hay equipos.'
                }) :
                res.status(200).send({
                    status: 'success',
                    teams
                });
        })
        .catch((err) => {
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver los equipos.',
                error: err
            });
        });
    },
    update: (req, res) => {
        const teamId = req.params.id;
        const params = req.body;
        if(teamId){
            Team.findOneAndUpdate({_id: teamId}, params, {new: true})
            .then((teamUpdated) => {
                return !teamUpdated ?
                    res.status(400).send({
                        status: 'error',
                        message: 'El equipo no se ha actualizado.'
                    }) :
                    res.status(200).send({
                        status: 'Updated',
                        team: teamUpdated
                    });
            })
            .catch((err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar el equipo.',
                    error: err
                    });
            });
        }else{
            return res.status(400).send({
                status: 'error',
                message: 'Los datos no son válidos.'
            });
        }
    },
    delete: (req, res) => {
        const teamId = req.params.id;
        if(teamId){
            Team.findByIdAndDelete({_id: teamId})
            .then((teamDeleted) => {
                return !teamDeleted ?
                    res.status(400).send({
                        status: 'error',
                        message: 'El equipo no se ha eliminado.'
                    }) :
                    res.status(200).send({
                        status: 'Deleted',
                        team: teamDeleted
                    });
            })
            .catch((err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar el equipo.',
                    error: err
                });
            });
        }else{
            return res.status(400).send({
                status: 'error',
                message: 'Los datos no son válidos.'
            });
        }
    }
        
};

module.exports = controller;