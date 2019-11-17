/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('CreepPrototype');
 * mod.thing == 'a thing'; // true
 */

module.exports = function () {
	Creep.prototype.WithdrawEnergy =
		function (structures, minUsedCapacity) {
            if(!minUsedCapacity){
                minUsedCapacity = 1;
            }
            if(!structures){
                if(this.room.storage){
                    structures = [STRUCTURE_STORAGE]
                }
                else if(this.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
                                                                     s.store.getUsedCapacity(RESOURCE_ENERGY) >= this.store.getFreeCapacity(RESOURCE_ENERGY)})){
                    structures = [STRUCTURE_CONTAINER];
                }
                else{
                    this.HarvestEnergy();
                    return;
                }
            }
			var energyStructure = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (structures.includes(s.structureType) && s.store.getUsedCapacity(RESOURCE_ENERGY) >= minUsedCapacity &&
                                (!Memory["transferLinks"] || !Memory.transferLinks[s.id]))
			});

            if (energyStructure) {
                if (this.withdraw(energyStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(energyStructure, { maxRooms: 1 });
				}
            }
        }

    Creep.prototype.TransferEnergy =
        function (structures) {
            var storageStructure = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (structures.includes(s.structureType) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            });
            
            if (storageStructure) {
                if (this.transfer(storageStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(storageStructure, { maxRooms: 1 });
                }
            }
        }

    Creep.prototype.PickupEnergy = 
        function (range) {
            var dropped = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (e) => e.resourceType == RESOURCE_ENERGY && e.pos.getRangeTo(this) <= range &&
                                e.amount >= this.store.getFreeCapacity(RESOURCE_ENERGY)});

            
            if(dropped){
                if( this.pickup(dropped) == ERR_NOT_IN_RANGE) {
                    this.moveTo(dropped);
                }
                return true;
            }
            return false;
        }

    Creep.prototype.HarvestEnergy =
        function () {
            var source = this.pos.findClosestByPath(FIND_SOURCES);
            if (source) {
                if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                    this.moveTo(source, { maxRooms: 1 });
                }
            }
        }

    Creep.prototype.CheckState = 
        function () {
            if (this.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && !this.memory.working) {
                this.memory.working = true;
            }
            else if(this.store.getUsedCapacity(RESOURCE_ENERGY) == 0 && this.memory.working)
            {
                this.memory.working = false;
            }
        }
};