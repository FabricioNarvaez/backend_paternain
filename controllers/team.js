'use strict'

const validator = require('validator');
const { TeamModelA, TeamModelB } = require('../models/team');

const controller = {
    test: (req, res) => {
        return res.status(200).send({
            message: 'Test'
        });
    },
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
    getPlayers: async (req, res) => {
        try{
            const teamsA = await TeamModelA.find();
            const teamsB = await TeamModelB.find();
            const teams = teamsA.concat(teamsB);

            const data = [];

            teams.forEach(team =>{
                const teamData = {};
                teamData.players = [];
                const players = team._doc.players;
                const teamName = team._doc.team;
                for(let key in players){
                    if(players[key] !== 0){
                        teamData.players.push({
                            name: key,
                            goals: players[key],
                            team: teamName
                        })
                    }
                }
                if(Object.keys(teamData).length !== 0){
                    data.push(teamData);
                }
            })

            function orderByGoals(a,b){
                return b.goals - a.goals;
            }

            const allPlayers = data.reduce((acumulador, item) => {
                return acumulador.concat(item.players);
            }, []);
            const dataOrdered = allPlayers.sort(orderByGoals);

            return !teams ?
                    res.status(400).send({
                        status: 'error',
                        message: 'No hay jugadores.'
                    }) :
                    res.status(200).send({
                        status: 'success',
                        data: dataOrdered
                    });

        }catch(err){
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver los jugadores.',
                error: err
            });
        }
    },
    getTeam: (req, res) => {
        const teamId = req.params.id;
        const group = req.params.group.toUpperCase();
        const Team = group === 'A' ? TeamModelA : TeamModelB;

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
    updateMatchData: async (req, res) =>{
        function getTotalGoals(array){
            return array.reduce((total, goalsScored) => {
                if (!isNaN(goalsScored)) {
                return total + goalsScored;
                }
                return total;
            }, 0)
        }

        function createUpdateObject(localWins, draw, goalsA, goalsB){
            return {
                $inc: {
                PG: localWins && !draw ? 1 : 0,
                PE: draw ? 1 : 0,
                PP: !localWins && !draw  ? 1 : 0,
                GF: goalsA,
                GC: goalsB,
                },
            };
        }

        function addPlayersToUpdateData(array, updateObject){
            for (let player of array) {
                updateObject.$inc[`players.${player.name}`] = parseInt(player.goals);
            }
            return updateObject;
        }

        async function updateData(req, model){
            const { local, visitor } = req.body;
            const localGoalsArray = local.goals.map((goal) => parseInt(goal.goals, 10));
            const visitorGoalsArray = visitor.goals.map((goal) => parseInt(goal.goals, 10));

            const localTotalGoals = getTotalGoals(localGoalsArray);
            const visitorTotalGoals = getTotalGoals(visitorGoalsArray);
        
            const localWins = localTotalGoals > visitorTotalGoals;
            const draw = localTotalGoals === visitorTotalGoals;

            let updateLocal = createUpdateObject(localWins, draw, localTotalGoals, visitorTotalGoals);
            let updateVisitor = createUpdateObject(!localWins, draw, visitorTotalGoals, localTotalGoals);

            updateLocal = addPlayersToUpdateData(local.goals, updateLocal);
            updateVisitor = addPlayersToUpdateData(visitor.goals, updateVisitor);

            await model.findOneAndUpdate({ team: local.team },updateLocal,{ new: true });
            await model.findOneAndUpdate({ team: visitor.team }, updateVisitor,{ new: true });
        }

        try {
            const params = req.body;
            const teamGropA = await TeamModelA.findOne({ team: params.local.team });
            if (teamGropA) {
                updateData(req, TeamModelA);
            } else if(await TeamModelB.findOne({ team: params.local.team })) {
                updateData(req, TeamModelB);
            }
          } catch (error) {
            return res.status(400).send({
                status: 'error',
                message: 'Error al actualizar.'
            });
          }
          
        res.send('Datos del partido actualizados.');
    },
    update: (req, res) => {
        const teamId = req.params.id;
        const group = req.params.group.toUpperCase();
        const Team = group === 'A' ? TeamModelA : TeamModelB;
        
        if(teamId){
            Team.findOne({_id: teamId})
            .then((team) => {
                if(!team){
                    return res.status(400).send({
                        status: 'error',
                        message: 'No hay equipo.'
                    });
                }else{
                    const { PP = 0, PE = 0, PG = 0, GF = 0, GC = 0 } = req.body;
                    const newPP = parseInt(team.PP) + parseInt(PP);
                    const newPE = parseInt(team.PE) + parseInt(PE);
                    const newPG = parseInt(team.PG) + parseInt(PG);
                    const newGF = parseInt(team.GF) + parseInt(GF);
                    const newGC = parseInt(team.GC) + parseInt(GC);
                    const newValues = {PP: newPP, PE: newPE, PG: newPG, GF: newGF, GC: newGC};
                    return Team.findOneAndUpdate({_id: teamId}, newValues, {new: true})
                }
            })
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
        const group = req.params.group.toUpperCase();
        const Team = group === 'A' ? TeamModelA : TeamModelB;

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