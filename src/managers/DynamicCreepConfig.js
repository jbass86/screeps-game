"use strict";
 
const roleConfig = {
    "miner": {
        name: "Miner", 
        role: "miner", 
        numToHave : 2, 
        parts: [MOVE, WORK, WORK, WORK, WORK],
        minParts: 3
    },
    "harvester": {
        name: "Harvester", 
        role: ["harvester", "upgrader"], 
        numToHave : 4, 
        parts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        minParts: 3
    },
    "upgrader": {
        name: "Upgrader", 
        role: "upgrader", 
        numToHave : 2, 
        parts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        minParts: 3
    },
    "builder": {
        name: "Builder", 
        role: ["builder", "upgrader"], 
        numToHave : 3, 
        parts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        minParts: 3
    },
    "maintainer": {
        name: "Maintainer", 
        role: ["maintainer", "harvester", "upgrader"], 
        numToHave : 2, 
        parts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        minParts: 3
    },
    "wallguy": {
        name: "WallGuy", 
        role: ["wallguy", "upgrader"], 
        numToHave : 1, 
        parts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        minParts: 3
    },
};

module.exports = class DynamicCreepConfig {


    generateConfig(room) {
        
    }
}