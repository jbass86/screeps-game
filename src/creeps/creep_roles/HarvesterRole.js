"use strict";

//Harvester Roule

const BaseRole = require("BaseRole");


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
              
                //Find the lowest energy thing and fill that...
                targets.sort((a, b) => {
                    if (a.structureType === "tower" && (a.store.getUsedCapacity(RESOURCE_ENERGY) / a.store.getCapacity() <= .5)) {
                        //if a tower is low give it more weight than normal...
                        return (a.store.getUsedCapacity(RESOURCE_ENERGY) - 100) - b.store.getUsedCapacity(RESOURCE_ENERGY);
                    } else {
                        //otherwise fill the lowest thing...
                        return a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY);
                    }
                });

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
