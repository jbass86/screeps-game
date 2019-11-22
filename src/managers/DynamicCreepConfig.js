"use strict";
 
const roleConfig = {
    "miner": {
        name: "Miner", 
        role: "miner", 
        minParts: [MOVE, WORK],
        segment: [WORK]
    }
};

module.exports = class DynamicCreepConfig {

    getRoles() {
        return Object.keys(roleConfig);
    }

    generateConfig(room) {
        console.log(room);
        console.log(roleConfig);
    }
};