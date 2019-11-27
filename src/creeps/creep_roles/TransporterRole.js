"use strict";

//Harvester Roule

const BaseRole = require("BaseRole");

const gatherPriority = [
    {name: "ground", style: "closest"}, 
    {name: "container", style: "most"}
];

module.exports = class TransporterRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {
        
        if (!this.gather(creep, RESOURCE_ENERGY, gatherPriority)) {

            if (!creep.memory.transportTarget) {
                const storage = creep.room.find(FIND_STRUCTURES, {
                    filter: (struct) => struct.structureType === STRUCTURE_STORAGE
                });

                if (storage && storage[0]) {
                    creep.memory.transportTarget = storage[0].id;
                }
            }

            if (creep.memory.transportTarget) {
                const storage = Game.getObjectById(creep.memory.transportTarget);
                let dumpSuccess = creep.transfer(storage, RESOURCE_ENERGY);
                if (dumpSuccess === OK) {
                    delete creep.memory.transportTarget;
                } else if (dumpSuccess === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                } else if (dumpSuccess === ERR_FULL) {
                    //Storage is full do something else with the energy...
                    delete creep.memory.transportTarget;
                    return false;
                } else {
                    delete creep.memory.transportTarget;
                }
            }
        }
        return true;
    }
};
