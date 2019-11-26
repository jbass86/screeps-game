/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Miner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run(creep) {
        //creep.say("Miner!");
		var targetContainer = undefined;
		if (!creep.memory["container"]) {
			targetContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
					(Memory["containers"] == undefined ||
						Memory.containers[s.id] == undefined ||
						Memory.containers[s.id].miner == false)
			});
			if (targetContainer) {
				creep.memory.container = targetContainer.id;

				if (Memory["containers"] == undefined) {
					Memory.containers = {};
				}

				if (Memory.containers[targetContainer.id] == undefined) {
					Memory.containers[targetContainer.id] = { miner: true, transporter: false };
				}
				else {
					Memory.containers[targetContainer.id].miner = true;
				}
			}
		}
		else {
			targetContainer = Game.getObjectById(creep.memory.container);
		}
		
		if (creep.pos.x != targetContainer.pos.x || creep.pos.y != targetContainer.pos.y || creep.pos.room != targetContainer.pos.room) {
			creep.moveTo(targetContainer, { maxRooms: 1, ignoreCreeps: false });
		}
		else {
			var source = creep.pos.findClosestByPath(FIND_SOURCES);
			creep.harvest(source);
		}
    }

};