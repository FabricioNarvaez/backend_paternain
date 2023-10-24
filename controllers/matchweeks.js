'use strict'

// const validator = require('validator');
const { matchWeeksModel } = require('../models/matchweeks');
const { TeamModelA, TeamModelB } = require('../models/team');

const controller = {
    getMatchWeeks: async (req, res) =>{
        try{
            const matchWeeks = await matchWeeksModel.find();
            for (let week of matchWeeks) {
                for (let hourMatch of week.matches) {
                  const localA = await TeamModelA.findOne({ team: hourMatch.groupA.local });
                  const visitorA = await TeamModelA.findOne({ team: hourMatch.groupA.visitor });
                  hourMatch.groupA["localLogo"] = localA.logo ? localA.logo : "https://res.cloudinary.com/dzd68sxue/image/upload/v1695396332/WEBP/default-bnoacd-1_qnmcps.webp";
                  hourMatch.groupA["visitorLogo"] = visitorA.logo ? visitorA.logo : "https://res.cloudinary.com/dzd68sxue/image/upload/v1695396332/WEBP/default-bnoacd-1_qnmcps.webp";
                  
                  const localB = await TeamModelB.findOne({ team: hourMatch.groupB.local });
                  const visitorB = await TeamModelB.findOne({ team: hourMatch.groupB.visitor });
                  hourMatch.groupB["localLogo"] = localB.logo ? localB.logo : "https://res.cloudinary.com/dzd68sxue/image/upload/v1695396332/WEBP/default-bnoacd-1_qnmcps.webp";
                  hourMatch.groupB["visitorLogo"] = visitorB.logo ? visitorB.logo : "https://res.cloudinary.com/dzd68sxue/image/upload/v1695396332/WEBP/default-bnoacd-1_qnmcps.webp";
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