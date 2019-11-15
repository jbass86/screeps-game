/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('LongRangeHarvester');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run(creep) {
        //creep.say("LongRangeHarvester!");
        
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && !creep.memory.working) {
            creep.memory.working = true;
        }
        else if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 && creep.memory.working){
            creep.memory.working = false;
        }

        if(!creep.memory["home"]){
            creep.memory.home = creep.room.storage.id;
            let exit = Game.getObjectById(creep.memory.home).pos.findClosestByPath(FIND_EXIT);
            creep.memory.exit = exit;
        }

        if(creep.memory.working)
        {
            if(creep.transfer(Game.getObjectById(creep.memory.home), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(creep.memory.home));
            }
        }
        else
        {
            if(creep.room == Game.getObjectById(creep.memory.home).room)
            {
                creep.moveTo(creep.memory.exit.x, creep.memory.exit.y);
            }
            else {
                creep.HarvestEnergy();
            }
        }
    }
};