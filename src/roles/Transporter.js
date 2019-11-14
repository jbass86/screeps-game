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
        //creep.say("Transporter!");
        if(creep.memory.working) 
		{
			var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => (s.structureType == STRUCTURE_STORAGE)
					&& s.store.getFreeCapacity() > 0
            });
            if(structure != undefined)
            {
                if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, {maxRooms:1});
                }
            }
            if(creep.carry.energy == 0)
            {
                creep.memory.working = false;
            }
        }
        else
		{
            var withdrawResult;
            if(!creep.memory["target"]){
                 var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER || (s.structureType == STRUCTURE_LINK && !Memory.transferLinks[s.id])) &&
                        s.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity()
                });
                if(container)
                {
                    creep.memory.target = container.id;
                }
            }
            if(creep.memory["target"])
            {
                withdrawResult = creep.withdraw(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY);
                if (withdrawResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.target), {maxRooms:1});
                }
                if (creep.carry.energy == creep.carryCapacity || withdrawResult == OK)
                {
                    creep.memory.working = true;
                    delete creep.memory.target;
                }
            }
        }
    }

};