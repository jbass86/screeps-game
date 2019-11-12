/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Harvester');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run(creep) {
        //creep.say("Harvester!");
        if(creep.memory.working) 
        {
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
                               s.structureType == STRUCTURE_EXTENSION ||
                               s.structureType == STRUCTURE_TOWER)
                               && s.energy < s.energyCapacity
            });
            if(structure != undefined)
            {
                //console.log(creep.name + " " + creep.transfer(structure, RESOURCE_ENERGY) + " into " + structure.structureType + " with id " + structure.id);
                if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, {maxRooms:1});
                }
            }
            if(creep.carry.energy == 0)
            {
                creep.memory.working = false;
            }
        }
        else
        {
			var source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (s) => s.energy > 0 });
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {maxRooms:1});
            }
            if(creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.working = true;
            }
        }
    }

};