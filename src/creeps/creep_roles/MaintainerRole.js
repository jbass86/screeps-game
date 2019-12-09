"use strict";

const BaseRole = require("BaseRole");

module.exports = class MaintainerRole extends BaseRole {

    constructor() {
        super();
    }

    run(creep, role) {
    
        if (creep.memory.canRepair) {

            if (creep.store[RESOURCE_ENERGY] > 0) {

                if (!creep.memory.repairTarget) {
                     
                    if (role === "wallguy") {
                        let damagedWalls = creep.room.find(FIND_STRUCTURES, {
                            filter: (struct) => struct.hits < struct.hitsMax && struct.structureType === STRUCTURE_WALL
                        });

                        if (damagedWalls && damagedWalls.length > 0) {
                            damagedWalls.sort((a, b) => a.hits - b.hits);
                            creep.memory.repairTarget = damagedWalls[0].id;
                        } else {
                            //Walls are ok...
                            return false;
                        }

                    } else {
                      
                        const damagedStructures = creep.room.find(FIND_STRUCTURES, {
                            filter: (struct) => struct.hits < struct.hitsMax && struct.structureType !== STRUCTURE_WALL
                        });
                        
                        if (damagedStructures && damagedStructures.length >= 1) {
                            
                            let lowestPercent = 1;
                            let weakestStructure = null;
                            for (let structure of damagedStructures) {
                                const percent = structure.hits / structure.hitsMax;
                                if (percent < lowestPercent) {
                                    lowestPercent = percent;
                                    weakestStructure = structure;
                                }
                            }
    
                            if (weakestStructure) {
                                creep.memory.repairTarget = weakestStructure.id;
                            } else {
                                //There is no structure to repair so we cannot perform this role...
                                return false;
                            }
                        } else {
                            return false;
                        }
                       
                    }        
                }

                const damagedStructure = Game.getObjectById(creep.memory.repairTarget);
                let repairSuccess = creep.repair(damagedStructure);
                if (repairSuccess !== OK) {
                    if(repairSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(damagedStructure, {maxRooms:1});
                    } else {
                        //Something else is wrong just drop the repair target
                        delete creep.memory.repairTarget;
                    }
                } else {
                    if (damagedStructure.hits === damagedStructure.hitsMax) {
                        //Structure is repaired so clear target from creep memory
                        delete creep.memory.repairTarget;
                    }
                }
            } else {
                //we want wallguy to work on walls evenly
                role === "wallguy" ? delete creep.memory.repairTarget : null;
                creep.memory.canRepair = false;
            }

        } else {
            if (!this.gather(creep, RESOURCE_ENERGY)) {
                creep.memory.canRepair = true;
            }
        }

        return true;
    }
};