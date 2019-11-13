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
        //creep.say("Repairer!");
        if(creep.memory.working)
        {
            var structures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
            });
            if(structures != undefined)
            {
                if(creep.memory.target == undefined)
                {
                    creep.memory.target =structures;
                }
                else if (Game.getObjectById(creep.memory.target.id).hits == Game.getObjectById(creep.memory.target.id).hitsMax)
                {
                    creep.memory.target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL});
                }
                if(creep.repair(structures) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.target.id), {maxRooms:1});
                }
                if(creep.carry.energy == 0)
                {
                    creep.memory.working = false;
                }
            }
            else
            {
                builder.run(creep);
            }
        }
        else
        {
            creep.GatherEnergy();
        }
    }

};