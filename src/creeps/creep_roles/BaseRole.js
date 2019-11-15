"use strict";

module.exports = class BaseRole {

    constructor() {}

    gatherEnergy(creep) {
        
        if(creep.store.getFreeCapacity() > 0) {

            if (!creep.memory.gatherTarget) {


                let energyOnGround = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: (item) => item.resourceType === RESOURCE_ENERGY
                });
                if (energyOnGround) {
                    creep.memory.gatherTarget = {
                        id: energyOnGround.id, 
                        elapsedTicks: 0,
                        type: "energy_on_ground"   
                    }
                } else {
                    //continers that have energy in them
                    let containers = creep.room.find(FIND_STRUCTURES, {
                        filter: (struct) => struct.structureType === STRUCTURE_CONTAINER && 
                            struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                    });

                    if (containers.length > 0) {
                        creep.memory.gatherTarget = {
                            id: containers[Math.abs(Math.round(Math.random() * (containers.length - 1)))].id, 
                            elapsedTicks: 0,
                            type: "container"   
                        }
                    } else {
                        const sources = creep.room.find(FIND_SOURCES);   
                        creep.memory.gatherTarget = {
                            id: sources[Math.abs(Math.round(Math.random() * (sources.length - 1)))].id, 
                            elapsedTicks: 0,
                            type: "energy_source"   
                        }
                    }
                }
            }

            const target = Game.getObjectById(creep.memory.gatherTarget.id);
            const type = creep.memory.gatherTarget.type;
            let gatherSuccess;
            if (type === "energy_source") { 
                gatherSuccess = creep.harvest(target);
            } else if (type === "container") {
                gatherSuccess = creep.withdraw(target, RESOURCE_ENERGY);
            } else if (type === "energy_on_ground") {
                gatherSuccess = creep.pickup(target);
            }
            
            if (gatherSuccess !== OK) {
                creep.memory.gatherTarget.elapsedTicks++;
                
                if(gatherSuccess === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else if (gatherSuccess === ERR_NOT_ENOUGH_RESOURCES || 
                    gatherSuccess === ERR_INVALID_TARGET){
                    //Its empty or invalid find something else...
                    delete creep.memory.gatherTarget
                    return true;
                } else {
                    console.log("Unexpected Gather Error " + gatherSuccess);
                    delete creep.memory.gatherTarget
                }
                
                if (creep.memory.gatherTarget.elapsedTicks > 100) {
                    creep.say("give up");
                    delete creep.memory.gatherTarget;
                }
            }
    
            return true;
        } else {
            delete creep.memory.gatherTarget;
            return false;
        }
    }
}