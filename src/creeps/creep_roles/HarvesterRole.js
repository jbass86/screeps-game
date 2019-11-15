"use strict";

//Harvester Roule

const BaseRole = require("BaseRole");

const priorities = {
    tower: 3,
    extension: 2, 
    spawn: 1
}

module.exports = class HarvesterRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {
        
        if (!this.gatherEnergy(creep)) {
            
            if (!creep.memory.transferTarget) {
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                
                if(targets.length === 0) {
                    //Theres nowhere to put the energy...
                    return false;
                }  
              
                targets.sort((a, b) => priorities[a.structureType] > priorities[b.structureType]);
                creep.memory.transferTarget = targets[0].id;
            } 
            
            const target = Game.getObjectById(creep.memory.transferTarget);
            const transferSuccess = creep.transfer(target, RESOURCE_ENERGY); 
            if (transferSuccess === OK) {
                creep.say("😀");
                delete creep.memory.transferTarget;
            } else {
                if(transferSuccess === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    delete creep.memory.transferTarget;
                }
            }
        }
        
        return true;
    }
};
