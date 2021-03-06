"use strict";

module.exports = class TowerRepairman {

    //TODO maybe work out a way for towers and maintainers to repair walls...
    run(tower) {

        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > ((tower.store.getCapacity(RESOURCE_ENERGY) * .5) + 10)) {
            let damagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (struct) => (struct.structureType !== STRUCTURE_WALL && struct.hits < struct.hitsMax)
            });

            if (damagedStructure) {
                tower.repair(damagedStructure);
                return true;
            }
        }
        return false;
    }
};