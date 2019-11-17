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
        creep.CheckState()
        if (creep.memory.working) {
            creep.TransferEnergy([STRUCTURE_SPAWN, STRUCTURE_EXTENSION]);
        }
        else {
            creep.WithdrawEnergy(undefined, creep.store.getFreeCapacity(RESOURCE_ENERGY));
        }
           
    }

};