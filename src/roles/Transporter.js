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
					&& s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
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
            var source = undefined;
            source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (s) => s.resourceType = RESOURCE_ENERGY && s.amount > creep.store.getCapacity(RESOURCE_ENERGY)
            });
            if(source == undefined){
                if(creep.memory.hasOwnProperty("container"))
                {
                    source = Game.getObjectById(creep.memory.container);
                }
                else
                {
                    source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
                            (Memory["containers"] == undefined ||
                                Memory.containers[s.id] == undefined ||
                                Memory.containers[s.id].transporter == false)
                    });
                    
                    creep.memory.container = source.id;
                    if (Memory["containers"] == undefined) {
                        Memory.containers = {};
                    }

                    if (Memory.containers[source.id] == undefined) {
                        Memory.containers[source.id] = { miner: false, transporter: true };
                    }
                    else {
                        Memory.containers[source.id].transporter = true;
                    }
                    
                }
                withdrawResult = creep.withdraw(source, RESOURCE_ENERGY);
                if (withdrawResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {maxRooms:1});
                }
            }
            else {
                withdrawResult = creep.pickup(source);
                if (withdrawResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {maxRooms:1});
                }

            }
            if (creep.carry.energy == creep.carryCapacity || withdrawResult == OK)
            {
                creep.memory.working = true;
            }
        }
    }

};