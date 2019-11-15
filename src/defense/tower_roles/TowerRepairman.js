"use strict";

module.exports = class TowerRepairman {


    run(tower) {

        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) >= (tower.store.getCapacity(RESOURCE_ENERGY) * .5)) {
            let damagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (struct) => struct.hits < struct.hitsMax
            });

            if (damagedStructure) {
                tower.repair(damagedStructure);
                return true;
            }
        }
        return false;
    }
}