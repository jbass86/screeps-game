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
			console.log("Gotta move it now!");
			var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => (s.structureType == STRUCTURE_STORAGE)
					&& s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if(structure != undefined)
            {
                //console.log(creep.name + " " + creep.transfer(structure, RESOURCE_ENERGY) + " into " + structure.structureType + " with id " + structure.id);
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
			console.log("gotta collect!");
            var source = undefined;
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

				console.log(source);
				creep.memory.container = source.id;
				console.log("Check memory!");
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
			console.log(creep.withdraw(source, RESOURCE_ENERGY));
			if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {maxRooms:1});
			}
			if (creep.carry.energy == creep.carryCapacity || (Game.getObjectById(creep.memory.container).store.getUsedCapacity(RESOURCE_ENERGY) == 0 && creep.carry.energy > 0))
            {
                creep.memory.working = true;
            }
        }
    }

};