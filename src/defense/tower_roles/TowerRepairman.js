"use strict";

module.exports = class TowerRepairman {


    run(tower) {

        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) >= (tower.store.getCapacity(RESOURCE_ENERGY) * .5)) {
            let damagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (struct) => (struct.structureType !== STRUCTURE_WALL && struct.hits < struct.hitsMax) || 
                    (struct.structureType == STRUCTURE_WALL && struct.hits < struct.hitsMax / 2)
            });

            if (damagedStructure) {
                tower.repair(damagedStructure);
                return true;
            }
        }
        return false;
    }
}