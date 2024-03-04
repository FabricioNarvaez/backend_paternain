'use strict'

const validator = require('validator');
const { TeamModelA, TeamModelB } = require('../models/team');
const { matchWeeksModel } = require('../models/matchweeks');

const controller = {
    test: (req, res) => {
        return res.status(200).send({
            message: "Test",
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
        const validate_group = !validator.isEmpty(group);

        if (
            validate_team &&
            validate_PG &&
            validate_PE &&
            validate_PP &&
            validate_GF &&
            validate_GC &&
            validate_group
        ) {
            const team = group === "A" ? new TeamModelA() : new TeamModelB();

            team.team = params.team;
            team.PG = params.PG;
            team.PE = params.PE;
            team.PP = params.PP;
            team.GF = params.GF;
            team.GC = params.GC;

            team.save()
                .then((teamStored) => {
                    return !teamStored
                        ? res.status(400).send({
                              status: "error",
                              message: "El equipo no se ha guardado.",
                          })
                        : res.status(201).send({
                              status: "Created",
                              team: teamStored,
                          });
                })
                .catch((err) => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al guardar el equipo.",
                        error: err,
                    });
                });
        } else {
            return res.status(400).send({
                status: "error",
                message: "Los datos no son válidos.",
            });
        }
    },
    getTeams: async (req, res) => {
        try {
            const teamsA = await TeamModelA.find();
            const teamsB = await TeamModelB.find();

            return !teamsA || !teamsB
                ? res.status(400).send({
                      status: "error",
                      message: "No hay equipos.",
                  })
                : res.status(200).send({
                      status: "success",
                      teamsGroupA: teamsA,
                      teamsGroupB: teamsB,
                  });
        } catch (err) {
            return res.status(500).send({
                status: "error",
                message: "Error al devolver los equipos.",
                error: err,
            });
        }
    },
    getMatchweekAdmin: async (req, res) => {
        try {
            const matchweek = await matchWeeksModel.find();
            return res.status(200).send({ matchweek });
        } catch (error) {
            return res.status(404).send({ message: error });
        }
    },
    getPlayers: async (req, res) => {
        try {
            const teamsA = await TeamModelA.find();
            const teamsB = await TeamModelB.find();
            const teams = teamsA.concat(teamsB);

            const data = [];

            teams.forEach((team) => {
                const teamData = {};
                teamData.players = [];
                const players = team._doc.players;
                const teamName = team._doc.team;
                if (players.length) {
                    for (let player of players) {
                        const goals = player.goals;
                        if (goals !== 0) {
                            teamData.players.push({
                                name: player.name,
                                number: player.number,
                                goals: goals,
                                team: teamName,
                            });
                        }
                    }
                }
                if (Object.keys(teamData).length !== 0) {
                    data.push(teamData);
                }
            });

            function orderByGoals(a, b) {
                return b.goals - a.goals;
            }

            const allPlayers = data.reduce((acumulador, item) => {
                return acumulador.concat(item.players);
            }, []);
            const dataOrdered = allPlayers.sort(orderByGoals);

            return !teams
                ? res.status(400).send({
                      status: "error",
                      message: "No hay jugadores.",
                  })
                : res.status(200).send({
                      status: "success",
                      data: dataOrdered,
                  });
        } catch (err) {
            return res.status(500).send({
                status: "error",
                message: "Error al devolver los jugadores.",
                error: err,
            });
        }
    },
    getTeamByName: (req, res) => {
        const teamName = req.params.name;
        const group = req.params.group;
        const Team = group === "groupA" ? TeamModelA : TeamModelB;

        if (teamName) {
            Team.findOne({ team: teamName })
                .then((team) => {
                    return !team
                        ? res.status(400).send({
                              status: "error",
                              message: "No hay equipo.",
                          })
                        : res.status(200).send({ team });
                })
                .catch((err) => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al devolver el equipo.",
                        error: err,
                    });
                });
        } else {
            return res.status(400).send({
                status: "error",
                message: "Los datos no son válidos.",
            });
        }
    },
    getTeamByID: (req, res) => {
        const teamId = req.params.id;
        const group = req.params.group.toUpperCase();
        const Team = group === "A" ? TeamModelA : TeamModelB;

        if (teamId) {
            Team.findById(teamId)
                .then((team) => {
                    return !team
                        ? res.status(400).send({
                              status: "error",
                              message: "No hay equipo.",
                          })
                        : res.status(200).send({
                              status: "success",
                              team,
                          });
                })
                .catch((err) => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al devolver el equipo.",
                        error: err,
                    });
                });
        } else {
            return res.status(400).send({
                status: "error",
                message: "Los datos no son válidos.",
            });
        }
    },
    savePlayers: async (req, res) => {
        try{
            const { team, players } = req.body;
            const teamGroupA = await TeamModelA.findOne({ team: team });
            const model = teamGroupA ? TeamModelA : TeamModelB;
            await model.findOneAndUpdate(
                { team: team },
                { $push: { players: { $each: players } } },
                { new: true}
            );
            res.send("Jugadores Actualizados.");
        } catch (error) {
            return res.status(400).send({
                status: "error",
                message: "Error al actualizar.",
            });
        };
    },
    updateMatchData: async (req, res) => {
        function getTotalGoals(array) {
            return array.reduce((total, object) => {
                const goals = object.goals;
                if (!isNaN(goals)) {
                    return total + goals;
                }
                return total;
            }, 0);
        }

        function createUpdateObject(localWins, draw, goalsA, goalsB) {
            return {
                $inc: {
                    PG: localWins && !draw ? 1 : 0,
                    PE: draw ? 1 : 0,
                    PP: !localWins && !draw ? 1 : 0,
                    GF: goalsA,
                    GC: goalsB,
                },
            };
        }

        async function updateMatchWeek(
            localTeam,
            visitorTeam,
            localTotalGoals,
            visitorTotalGoals,
            matchWeek,
            group,
            model
        ) {
            if (group === "groupA") {
                model
                    .updateOne(
                        { matchWeek: matchWeek },
                        {
                            $inc: {
                                "matches.$[elem].groupA.localResult":
                                    localTotalGoals,
                                "matches.$[elem].groupA.visitorResult":
                                    visitorTotalGoals,
                            },
                        },
                        {
                            arrayFilters: [
                                {
                                    $and: [
                                        { "elem.groupA.local": localTeam },
                                        { "elem.groupA.visitor": visitorTeam },
                                    ],
                                },
                            ],
                        }
                    )
                    .then((result) => {
                        console.log(result);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
            if (group === "groupB") {
                model
                    .updateOne(
                        { matchWeek: matchWeek },
                        {
                            $inc: {
                                "matches.$[elem].groupB.localResult":
                                    localTotalGoals,
                                "matches.$[elem].groupB.visitorResult":
                                    visitorTotalGoals,
                            },
                        },
                        {
                            arrayFilters: [
                                {
                                    $and: [
                                        { "elem.groupB.local": localTeam },
                                        { "elem.groupB.visitor": visitorTeam },
                                    ],
                                },
                            ],
                        }
                    )
                    .then((result) => {
                        console.log(result);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        }

        async function updateData(
            local,
            visitor,
            localTotalGoals,
            visitorTotalGoals,
            model
        ) {
            const localWins = localTotalGoals > visitorTotalGoals;
            const draw = localTotalGoals === visitorTotalGoals;

            let updateLocal = createUpdateObject(
                localWins,
                draw,
                localTotalGoals,
                visitorTotalGoals
            );
            let updateVisitor = createUpdateObject(
                !localWins,
                draw,
                visitorTotalGoals,
                localTotalGoals
            );

            function updatePlayerGoals(team) {
                team.players.forEach((player) => {
                    model
                        .updateOne(
                            { team: team.team },
                            { $inc: { "players.$[jug].goals": player.goals } },
                            { arrayFilters: [{ "jug.name": player.name }] }
                        )
                        .then((result) => {
                            console.log(result);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                });
            }

            updatePlayerGoals(local);
            updatePlayerGoals(visitor);

            await model.findOneAndUpdate({ team: local.team }, updateLocal, {
                new: true,
            });
            await model.findOneAndUpdate(
                { team: visitor.team },
                updateVisitor,
                { new: true }
            );
        }

        try {
            const { local, visitor, matchWeek, group } = req.body;
            const teamGroupA = await TeamModelA.findOne({ team: local.team });
            const localTotalGoals = getTotalGoals(local.players);
            const visitorTotalGoals = getTotalGoals(visitor.players);
            const localTeam = local.team;
            const visitorTeam = visitor.team;
            if (teamGroupA) {
                updateData(
                    local,
                    visitor,
                    localTotalGoals,
                    visitorTotalGoals,
                    TeamModelA
                );
            } else if (await TeamModelB.findOne({ team: local.team })) {
                updateData(
                    local,
                    visitor,
                    localTotalGoals,
                    visitorTotalGoals,
                    TeamModelB
                );
            }

            updateMatchWeek(
                localTeam,
                visitorTeam,
                localTotalGoals,
                visitorTotalGoals,
                matchWeek,
                group,
                matchWeeksModel
            );
        } catch (error) {
            return res.status(400).send({
                status: "error",
                message: "Error al actualizar.",
            });
        }

        res.send("Datos del partido actualizados.");
    },
    update: (req, res) => {
        const teamId = req.params.id;
        const group = req.params.group.toUpperCase();
        const Team = group === "A" ? TeamModelA : TeamModelB;

        if (teamId) {
            Team.findOne({ _id: teamId })
                .then((team) => {
                    if (!team) {
                        return res.status(400).send({
                            status: "error",
                            message: "No hay equipo.",
                        });
                    } else {
                        const {
                            PP = 0,
                            PE = 0,
                            PG = 0,
                            GF = 0,
                            GC = 0,
                        } = req.body;
                        const newPP = parseInt(team.PP) + parseInt(PP);
                        const newPE = parseInt(team.PE) + parseInt(PE);
                        const newPG = parseInt(team.PG) + parseInt(PG);
                        const newGF = parseInt(team.GF) + parseInt(GF);
                        const newGC = parseInt(team.GC) + parseInt(GC);
                        const newValues = {
                            PP: newPP,
                            PE: newPE,
                            PG: newPG,
                            GF: newGF,
                            GC: newGC,
                        };
                        return Team.findOneAndUpdate(
                            { _id: teamId },
                            newValues,
                            { new: true }
                        );
                    }
                })
                .then((teamUpdated) => {
                    return !teamUpdated
                        ? res.status(400).send({
                              status: "error",
                              message: "El equipo no se ha actualizado.",
                          })
                        : res.status(200).send({
                              status: "Updated",
                              team: teamUpdated,
                          });
                })
                .catch((err) => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al actualizar el equipo.",
                        error: err,
                    });
                });
        } else {
            return res.status(400).send({
                status: "error",
                message: "Los datos no son válidos.",
            });
        }
    },
    delete: (req, res) => {
        const teamId = req.params.id;
        const group = req.params.group.toUpperCase();
        const Team = group === "A" ? TeamModelA : TeamModelB;

        if (teamId) {
            Team.findByIdAndDelete({ _id: teamId })
                .then((teamDeleted) => {
                    return !teamDeleted
                        ? res.status(400).send({
                              status: "error",
                              message: "El equipo no se ha eliminado.",
                          })
                        : res.status(200).send({
                              status: "Deleted",
                              team: teamDeleted,
                          });
                })
                .catch((err) => {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al eliminar el equipo.",
                        error: err,
                    });
                });
        } else {
            return res.status(400).send({
                status: "error",
                message: "Los datos no son válidos.",
            });
        }
    },
};

module.exports = controller;