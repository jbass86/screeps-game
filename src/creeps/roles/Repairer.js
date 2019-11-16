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
            creep.TransferEnergy([STRUCTURE_TOWER]);
        }
        else
        {
            creep.WithdrawEnergy([STRUCTURE_STORAGE]);
        }
    }

};