/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Transporter');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run(creep) {
        //creep.say(creep.ticksToLive);

        creep.CheckState();
        if(creep.memory.working) 
		{
            creep.TransferEnergy([STRUCTURE_STORAGE]);
        }
        else
		{
            creep.PickupEnergy(20);
            creep.WithdrawEnergy([STRUCTURE_CONTAINER, STRUCTURE_LINK], creep.store.getFreeCapacity());
        }
    }

};