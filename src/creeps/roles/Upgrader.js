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
        creep.CheckState();
        if(creep.memory.working)
        {
            if(creep.upgradeController(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {maxRooms:1, ignoreCreeps: false});
            }
            if(creep.carry.energy == 0)
            {
                creep.memory.working = false;
            }
        }
        else
        {
            creep.WithdrawEnergy();
        }
    }
};