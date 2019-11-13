/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Repairer');
 * mod.thing == 'a thing'; // true
 */

var builder = require('Builder');

module.exports = {
    run(creep) {
        creep.say("Repairer!");
        if(creep.memory.working)
        {
            var structures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_TOWER
            });

            if(structures != undefined)
            {
                if(creep.transfer(structures, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(structures);
                }
            }
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.working = false;
            }
        }
        else
        {
            creep.GatherEnergy();
        }
    }

};