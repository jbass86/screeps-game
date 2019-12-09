"use strict";

const BaseRole = require("BaseRole");

module.exports = class UpgraderRole extends BaseRole {
    
    constructor() {
        super();
    }
    
    run(creep) {
        
        if (!creep.memory.upgrading) {
            let gatherResult = this.gather(creep, RESOURCE_ENERGY);
            if (!gatherResult) {
                //Energy is full so start upgrading...
                creep.memory.upgrading = true;
            }
        } else {

            let upgradeSuccess = creep.upgradeController(creep.room.controller);

            if (upgradeSuccess !== OK){
                if(upgradeSuccess === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {

                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.upgrading = false;
                    }
                    console.log(`${creep.name} upgrade error ${upgradeSuccess}`);
                }  
            }      
        }
        
        return true;
    }
};