"use strict";

//Harvester Roule

const BaseRole = require("BaseRole");

const gatherPriority = [
    {name: "ground", style: "closest"}, 
    {name: "tombstone", style: "closest"}, 
    {name: "container", style: "most"}
];

module.exports = class TransporterRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {
        
        if (!creep.memory.transporting) {
            let gather = this.gather(creep, null, gatherPriority);
            if (!gather) {
                creep.memory.transporting = true;
            }
        } else {

            if (!creep.memory.transportTarget) {
                const storage = creep.room.find(FIND_STRUCTURES, {
                    filter: (struct) => struct.structureType === STRUCTURE_STORAGE
                });

                if (storage && storage[0]) {
                    creep.memory.transportTarget = storage[0].id;
                }
            }

            if (creep.memory.transportTarget) {

                if (creep.store.getUsedCapacity() > 0) {
                    const storage = Game.getObjectById(creep.memory.transportTarget);
                    let dumpResource = Object.keys(creep.store)[0];
    
                    let dumpSuccess = creep.transfer(storage, dumpResource);
                    if (dumpSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    } else if (dumpSuccess === ERR_FULL) {
                        //Storage is full do something else with the energy...
                        this.finishedTransporting(creep);
                        return false;
                    } else {
                        console.log(`Unexpected Transport error ${dumpSuccess}`);
                        this.finishedTransporting(creep);
                    }
                } else {
                    //Nothing to dump...
                    this.finishedTransporting(creep);
                }
              
            }
        }

        return true;
    }

    finishedTransporting(creep) {
        delete creep.memory.transportTarget;
        creep.memory.transporting = false;
    }
};
