//Harvester Roule

const BaseRole = require("BaseRole");

module.exports = class HarvesterRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {
        
        if (!this.gatherEnergy(creep)) {
            
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            if(targets.length === 0) {
                //Theres nowhere to put the energy...
                return false;
            }
            
            const transferSuccess = creep.transfer(targets[0], RESOURCE_ENERGY)
            
            if (transferSuccess != OK) {
                if(transferSuccess === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        
        return true;
    }
};
