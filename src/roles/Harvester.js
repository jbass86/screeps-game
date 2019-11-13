/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Harvester');
 * mod.thing == 'a thing'; // true
 */
require('CreepPrototype')();
module.exports = {
    run(creep) {
        //creep.say("Harvester!");
        if (creep.memory.working) {
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
                    s.structureType == STRUCTURE_EXTENSION ||
                    s.structureType == STRUCTURE_TOWER) &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { maxRooms: 1 });
                }
            }
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.working = false;
            }
        }
        else {
            creep.GatherEnergy();
        }
           
    }

};