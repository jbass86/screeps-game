//A Miner role for drop mining on top of a container.  This role should not have any CARRY parts...

"use strict";

const BaseRole = require("BaseRole");

if (!Memory.usedContainers) {
    Memory.usedContainers = {};
}

module.exports = class MinerRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {
        
        Game.time % 10 === 0 ? this.cullStructureMap("usedContainers") : null;

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

                if (!creep.memory.mineTarget.harvestSourceId) {

                    //The closest harvestable source should be right next to this container if we can drop mine it.             
                    let source = creep.pos.findInRange(FIND_SOURCES, 1);
                    if (!source || source.length === 0) {
                        source = creep.pos.findInRange(FIND_MINERALS, 1);
                    }

                    if (source && source.length >= 1) {
                        creep.memory.mineTarget.harvestSourceId = source[0].id;
                    } else {
                        //The closest source isnt within distance to drop mine this container, we cant drop mine from it...
                        Memory.usedContainers[container.id] = "INVALID";
                        delete creep.memory.mineTarget;
                    }
                }

                if (creep.memory.mineTarget && creep.memory.mineTarget.harvestSourceId) {
                    let source = Game.getObjectById(creep.memory.mineTarget.harvestSourceId);
                    let success = creep.harvest(source);
                    if (success !== OK) {
                     
                        if (success === ERR_TIRED) {
                            creep.say("😓");
                        } else {
                            console.log(`${creep.name} mining error ${success}`);
                        }
                        
                    }
                }

            } else {
                creep.moveTo(container);
            }
        }

        return true;
    }
};
