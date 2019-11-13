
module.exports = class BaseRole {

    constructor() {}

    gatherEnergy(creep) {
        
        if(creep.store.getFreeCapacity() > 0) {

            const sources = creep.room.find(FIND_SOURCES);
            
            if (!creep.memory.gatherTarget) {
                creep.memory.gatherTarget = {
                    index: Math.abs(Math.round(Math.random() * (sources.length - 1))), 
                    elapsedTicks: 0 
                };
            }
            
            let harvestSuccess = creep.harvest(sources[creep.memory.gatherTarget.index]);
            
            if (harvestSuccess !== OK) {
                creep.memory.gatherTarget.elapsedTicks++;
                
                if(harvestSuccess === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.gatherTarget.index], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                
                if (creep.memory.gatherTarget.elapsedTicks > 100) {
                    creep.say("give up");
                    delete creep.memory.gatherTarget;
                }
            }
    
            return true;
        } else {
            delete creep.memory.gatherTarget;
            return false;
        }
    }
}