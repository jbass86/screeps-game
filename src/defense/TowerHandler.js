"use strict";

const CreepKiller = require("CreepKiller");
const killer = new CreepKiller();

const TowerRepairman = require("TowerRepairman");
const repair = new TowerRepairman();

const towerRoles = [killer, repair];

module.exports = class TowerHandler {

    constructor() {}

    run() {

        for (let room of Object.values(Game.rooms)) {

            const towers = room.find(FIND_STRUCTURES, {
                filter: (struct) => struct.structureType === STRUCTURE_TOWER
            });

            for (let tower of towers) {
                for (let role of towerRoles) {
                    if (role.run(tower)) {
                        break;
                    }
                }
            }
        }
    }
};