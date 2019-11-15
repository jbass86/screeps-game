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
            console.log("Get source now!");
            var links = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK});
            for(let link in links){
                source = links[link].pos.findInRange(FIND_SOURCES, 2)[0];
                console.log("Source is " +source);
                if(source){
                    Memory.transferLinks = Memory.transferLinks || {};
                    Memory.transferLinks[links[link].id] = true;
                    creep.memory.link = links[link].id;
                    transferLink = links[link];
                    console.log( links[link].pos.findPathTo(source)[0]);
                    creep.memory.mineLocation = links[link].pos.findPathTo(source)[0];
                    break;
                }
            }
            creep.memory.source = source.id;
        }
        else {
            source = Game.getObjectById(creep.memory.source);
            transferLink = Game.getObjectById(creep.memory.link);
        }
        
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.mineLocation.x, creep.memory.mineLocation.y);
        }
        creep.transfer(transferLink, RESOURCE_ENERGY);

        var targetLink = transferLink.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK &&
                                                                               s.store.getFreeCapacity(RESOURCE_ENERGY) > 100 &&
                                                                               !Memory.transferLinks[s.id]});
        //console.log(targetLink)
        transferLink.transferEnergy(targetLink);
    }
};