"use strict";

//Harvester Roule

const BaseRole = require("BaseRole");

const priorities = {
    spawn: 1,
    tower: 2,
    extension: 3, 
};

module.exports = class HarvesterRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {
        
        if (creep.memory.returnHarvest) {
            
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
              
                targets.sort((a, b) => priorities[b.structureType] - priorities[a.structureType]);
                creep.memory.transferTarget = targets[0].id;
            } 
            
            const target = Game.getObjectById(creep.memory.transferTarget);
            const transferSuccess = creep.transfer(target, RESOURCE_ENERGY); 
            if (transferSuccess === OK) {

                creep.say("😀");
                delete creep.memory.transferTarget;             
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    //I'm all out of energy so I need to get more...
                    creep.memory.returnHarvest = false;
                }
            } else {
                if(transferSuccess === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (transferSuccess === ERR_NOT_ENOUGH_ENERGY) {
                    //partial transfer
                    creep.memory.returnHarvest = false;
                } else {
                    console.log(creep.name + ": UnExpected Harvester Error " + transferSuccess);
                    delete creep.memory.transferTarget;
                }
            }
        } else {
            const gatherResult = this.gather(creep);
            if (!gatherResult) {
                //Were full of energy to dump off some harvest
                creep.memory.returnHarvest = true;
            }
        }     
        return true;
    }
};
