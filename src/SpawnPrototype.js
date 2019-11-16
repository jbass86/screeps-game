/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('SpawnPrototype');
 * mod.thing == 'a thing'; // true
 */

module.exports = function() {
    StructureSpawn.prototype.createCustomCreep = 
        function(energy, roleName, bodySequence, costPerSequence) {
            var numberOfParts = Math.floor(energy / costPerSequence);
			var body = [];
            for(let i = 0; i < numberOfParts; i++)
            {
                body = body.concat(bodySequence);
            }
            return this.createCreep(body, undefined, {role: roleName, working: false});
        }

    StructureSpawn.prototype.createEmergencyCreep = 
        function(numHarvesters, numMiners, numLinkMiners, numTransporters) {
            var transportSources = this.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER ||
                                                                                   s.structureType == STRUCTURE_LINK
            });
            
            var transportableEnergy = 0;
            for(let source of transportSources) {
                transportableEnergy += source.store.getUsedCapacity();
            }
                                                                                                 
            var spawnableEnergy = Math.max(this.room.energyAvailable, 300);
            var harvestableEnergy = spawnableEnergy + this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY);
            transportableEnergy += harvestableEnergy;
            if(numHarvesters == 0)
            {
                role = 'harvester';
                bodySequence = [CARRY, CARRY, MOVE];
                energyPerSequence = 150;
                energy = Math.min(spawnableEnergy, 450);
            }
            else if (numTransporters == 0) {
                role = 'transporter';
                bodySequence = [CARRY, CARRY, MOVE];
                energyPerSequence = 150;
                energy = Math.min(harvestableEnergy, 300);
            }
            else if (numMiners == 0) {
                role = 'miner';
                bodySequence = [WORK,WORK,MOVE];
                energyPerSequence = 250;
                energy = transportableEnergy;
            }
            name = this.createCustomCreep(energy, role, bodySequence, energyPerSequence);
        }
};