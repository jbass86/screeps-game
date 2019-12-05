"use strict";

const BaseRole = require("BaseRole");

module.exports = class UpgraderRole extends BaseRole {
    
    constructor() {
        super();
    }
    
    run(creep) {
        
        if (!creep.memory.upgrading) {
            let gatherResult = this.gather(creep);
            if (!gatherResult) {
                //Energy is full so start upgrading...
                creep.memory.upgrading = true;
            }
        } else {

            let upgradeSuccess = creep.upgradeController(creep.room.controller);

            if(upgradeSuccess == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if (upgradeSuccess === OK) {
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.upgrading = false;
                }
            } else {
                console.log(`${creep.name} upgrade error ${upgradeSuccess}`);
            }           
        }
        
        return true;
    }
};