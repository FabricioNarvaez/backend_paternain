'use strict'

const validator = require('validator');
const { TeamModelA, TeamModelB } = require('../models/team');

const controller = {
    save: (req, res) => {
        const params = req.body;
        const group = params.group.toUpperCase();
        
        const validate_team = !validator.isEmpty(params.team);
        const validate_PG = !validator.isEmpty(params.PG);
        const validate_PE = !validator.isEmpty(params.PE);
        const validate_PP = !validator.isEmpty(params.PP);
        const validate_GF = !validator.isEmpty(params.GF);
        const validate_GC = !validator.isEmpty(params.GC);
        const validate_group  = !validator.isEmpty(group);

        if(validate_team && validate_PG && validate_PE && validate_PP && validate_GF && validate_GC && validate_group){
            const team = group === 'A' ? new TeamModelA() : new TeamModelB();

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
    getTeams: async (req, res) => {
        try{
            const teamsA = await TeamModelA.find();
            const teamsB = await TeamModelB.find();

            return !teamsA || !teamsB ?
                    res.status(400).send({
                    status: 'error',
                    message: 'No hay equipos.'
                    }) :
                    res.status(200).send({
                    status: 'success',
                    teamsGroupA: teamsA,
                    teamsGroupB: teamsB
                    });

        }catch(err){
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver los equipos.',
                error: err
            });
        }
    },
    getTeam: (req, res) => {
        const teamId = req.params.id;
        if(teamId){
            Team.findById(teamId)
            .then((team) => {
                return !team ?
                    res.status(400).send({
                        status: 'error',
                        message: 'No hay equipo.'
                    }) :
                    res.status(200).send({
                        status: 'success',
                        team
                    });
            })
            .catch((err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver el equipo.',
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