/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('CreepPrototype');
 * mod.thing == 'a thing'; // true
 */

module.exports = function () {
	Creep.prototype.GatherEnergy =
		function () {
			var energyStructure = this.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => (s.structureType == STRUCTURE_STORAGE && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
			});

            if (energyStructure != undefined) {
                if (this.withdraw(energyStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(energyStructure, { maxRooms: 1 });
				}
            }
            if (this.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                this.memory.working = true;
            }
        }
};