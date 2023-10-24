'use strict'

// const validator = require('validator');
const { matchWeeksModel } = require('../models/matchweeks');
const { TeamModelA, TeamModelB } = require('../models/team');

const controller = {
    getMatchWeeks: async (req, res) =>{
        async function asignLogoToGrup(group, TeamModel) {
            const local = await TeamModel.findOne({ team: group.local });
            const visitor = await TeamModel.findOne({ team: group.visitor });
          
            group["localLogo"] = local?.logo || "https://res.cloudinary.com/dzd68sxue/image/upload/v1695396332/WEBP/default-bnoacd-1_qnmcps.webp";
            group["visitorLogo"] = visitor?.logo || "https://res.cloudinary.com/dzd68sxue/image/upload/v1695396332/WEBP/default-bnoacd-1_qnmcps.webp";
        }

        try{
            const matchWeeks = await matchWeeksModel.find();
            for (let week of matchWeeks) {
                for (let hourMatch of week.matches) {
                    await asignLogoToGrup(hourMatch.groupA, TeamModelA);
                    await asignLogoToGrup(hourMatch.groupB, TeamModelB);
                }
              }

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