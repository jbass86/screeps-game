//A Miner role for drop mining on top of a container.  This role should not have any CARRY parts...

"use strict";

//Harvester Roule

const BaseRole = require("BaseRole");

if (!Memory.usedContainers) {
    Memory.usedContainers = {};
}

module.exports = class MinerRole extends BaseRole {

    constructor() {
        super();
    }

    cullContainers() {
        for (let entry of Object.entries(Memory.usedContainers)) {
            if (entry[1] && entry[1] !== "INVALID") {    
                const creepLives = Game.creeps[entry[1]];
                if (!creepLives){
                    Memory.usedContainers[entry[0]] = false;
                }
            }
        }
    }

    run (creep) {
        
        Game.time % 10 === 0 ? this.cullContainers(): null;

        if (!creep.memory.mineTarget) {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (struct) => struct.structureType === STRUCTURE_CONTAINER && !Memory.usedContainers[struct.id]
            });

            if (container) {
                Memory.usedContainers[container.id] = creep.name;
                creep.memory.mineTarget = {
                    containerId: container.id
                };
            } else {
                //No containers available to mine at it seems...
                return false;
            }
        } else {
            let container = Game.getObjectById(creep.memory.mineTarget.containerId);

            if (creep.pos.x === container.pos.x && creep.pos.y === container.pos.y) {
                if (!creep.memory.energySourceId) {
                    //The closest energy should be right next to this container if we can drop mine it.
                    let source = creep.pos.findClosestByPath(FIND_SOURCES);
                    let testHarvest = creep.harvest(source);
                    if (testHarvest === OK) {
                        creep.memory.mineTarget.energySourceId = source.id;
                    } else if (testHarvest === ERR_NOT_IN_RANGE) {
                        //The closest source isnt withing distance to drop mind this container, we cant drop mine from it...
                        Memory.usedContainers[container.id] = "INVALID";
                        delete creep.memory.mineTarget;
                    } else {
                        //Something else went wrong
                        delete creep.memory.mineTarget;
                    }
                } else {
                    let source = Game.getObjectById(creep.memory.mineTarget.energySourceId);
                    creep.harvest(source);
                }
            } else {
                creep.moveTo(container);
            }
        }

        return true;
    }
};
