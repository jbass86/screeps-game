"use strict";

//Harvester Roule

const BaseRole = require("BaseRole");

if (!Memory.usedContainers) {
    Memory.usedContainers = {};
}

module.exports = class HarvesterRole extends BaseRole {

    constructor() {
        super();
    }

    cullContainers() {
        for (let entry of Object.entries(Memory.usedContainers)) {
            if (Game.creeps[Memory.usedContainers[entry[1]]] !== "INVALID" && !Game.creeps[Memory.usedContainers[entry[1]]]) {
                Memory.usedContainers[entry[0]] = false;
            }
        }
    }

    run (creep) {
        
        Game.time % 10 === 0 ? this.cullContainers(): null;

        if (!creep.memory.mineTarget) {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (struct) => !Memory.usedContainers[struct.id]
            });

            if (container) {
                creep.memory.mineTarget = {
                    containerId: container.id
                };
            } else {
                //No containers available to mine at it seems...
                return false;
            }
        } else {
            let container = Game.getObjectById(creep.memory.mineTarget.conotainerId);

            if (creep.pos.x === container.pos.x && creep.pos.y === container.pos.y) {
                if (!creep.memory.energySourceId) {
                    //The closest energy should be right next to this container if we can drop mine it.
                    let source = creep.pos.findClosestByPath(RESOURCE_ENERGY);
                    let testHarvest = creep.harvest(source)
                    if (testHarvest === OK) {
                        creep.memory.mineTarget.energySourceId = source.id;
                    } else if (testHarvest === ERR_NOT_IN_RANGE) {
                        //The closest source isnt withing distance to drop mind this container, we cant drop mine from it...
                        Memory.usedContainers[container.id] === "INVALID";
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
