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
        creep.CheckState();
        if(creep.memory.working)
        {
            if(creep.room.find(FIND_STRUCTURES), {filter: (s) => s.structureType == STRUCTURE_TOWER}){
                creep.TransferEnergy([STRUCTURE_TOWER]);
            }
            else{
                var dmgStruct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType != STRUCTURE_WALL &&
                                   s.structureType != STRUCTURE_RAMPART &&
                                   s.hits < s.hitsMax
                });
                if(!dmgStruct){
                    creep.repair(dmgStruct);
                }
            }
        }
        else
        {
            creep.WithdrawEnergy();
        }
    }

};