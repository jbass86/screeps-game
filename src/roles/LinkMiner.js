/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('LinkMiner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run(creep) {
        var source = undefined;
        var transferLink = undefined;
        if(!creep.memory["source"]){
            var links = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK});
            for(let link in links){
                source = links[link].pos.findInRange(FIND_SOURCES, 2)[0];
                if(source){
                    Memory.transferLinks = Memory.transferLinks || {};
                    Memory.transferLinks[links[link].id] = true;
                    creep.memory.link = links[link].id;
                    transferLink = links[link];
                    break;
                }
            }
            creep.memory.source = source.id;
        }
        else {
            source = Game.getObjectById(creep.memory.source);
            transferLink = Game.getObjectById(creep.memory.link);
        }
        
        console.log(creep.harvest(source))
        if(creep.store.getFreeCapacity() > 10 && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        if(creep.store.getFreeCapacity() == 0){
            if(creep.transfer(transferLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(transferLink);
            }
        }

        var targetLink = transferLink.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK &&
                                                                               s.store.getFreeCapacity(RESOURCE_ENERGY) > 100 &&
                                                                               !Memory.transferLinks[s.id]});
        console.log(targetLink)
        transferLink.transferEnergy(targetLink);
    }
};