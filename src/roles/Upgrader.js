/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Upgrader');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run(creep) {
        //creep.say("Upgrader!");
        if(creep.memory.working)
        {
            if(creep.upgradeController(Game.spawns.Spawn1.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1.room.controller, {maxRooms:1});
            }
            if(creep.carry.energy == 0)
            {
                creep.memory.working = false;
            }
        }
        else
        {
            creep.GatherEnergy();
        }
    }
};