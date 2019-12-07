"use strict";

//Harvester Roule

const BaseRole = require("BaseRole");

if (!Memory.claimedTransfers) {
    Memory.claimedTransfers = {};
}

module.exports = class HarvesterRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {
        
        Game.time % 10 === 0 ? this.cullStructureMap("claimedTransfers") : null;

        if (creep.memory.returnHarvest) {
            
            if (!creep.memory.transferTarget) {
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                            !Memory.claimedTransfers[structure.id];
                    }
                });
                
                if(targets.length === 0) {
                    //Theres nowhere to put the energy...
                    return false;
                }  
              
                //Find the lowest energy thing and fill that...
                targets.sort((a, b) => {
                        
                    let aScore = a.store.getUsedCapacity(RESOURCE_ENERGY);
                    let bScore = b.store.getUsedCapacity(RESOURCE_ENERGY);
                    
                    if (a.structureType === "tower" && (a.store.getUsedCapacity(RESOURCE_ENERGY) / a.store.getCapacity(RESOURCE_ENERGY) < .5)) {
                        aScore -= 500;
                    } 
                    if (b.structureType === "tower" && (b.store.getUsedCapacity(RESOURCE_ENERGY) / b.store.getCapacity(RESOURCE_ENERGY) < .5)) {
                        bScore -= 500;
                    } 
                        
                    return aScore - bScore;
                });

                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > targets[0].store.getFreeCapacity(RESOURCE_ENERGY)) {
                    Memory.claimedTransfers[targets[0].id] = creep.name;
                }
                creep.memory.transferTarget = targets[0].id;
            } 
            
            const target = Game.getObjectById(creep.memory.transferTarget);
            const transferSuccess = creep.transfer(target, RESOURCE_ENERGY); 
            if (transferSuccess === OK) {

                creep.say("😀");
                this.cleanupTransferTarget(creep);         
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
                } else if (transferSuccess === ERR_FULL) {
                    creep.say("🤢");
                    this.cleanupTransferTarget(creep);
                } else {
                    console.log(creep.name + ": UnExpected Harvester Error " + transferSuccess);
                    this.cleanupTransferTarget(creep);
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

    cleanupTransferTarget(creep) {
        delete Memory.claimedTransfers[creep.memory.transferTarget];
        delete creep.memory.transferTarget;
    }
};
