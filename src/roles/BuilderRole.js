//Builder Routine

const BaseRole = require("BaseRole");

module.exports =  class BuilderRoutine extends BaseRole {
    
    run(creep) {
        
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        
        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            
            if(targets.length === 0) {
                
                creep.memory.building = false;
                return false;
            }
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
           this.gatherEnergy(creep);
        }
        
        return true;
    }
};