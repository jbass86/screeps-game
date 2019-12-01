"use strict";

const BaseRole = require("BaseRole");

if (!Memory.linkMap) {
    Memory.linkMap = {};
}

module.exports = class LinkerRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {

        Game.time % 10 === 0 ? this.cullStructureMap("linkMap") : null;


        if (!creep.memory.linkTarget) {

            let links = creep.room.find(FIND_STRUCTURES, {
                filter: (struct) => struct.structureType === STRUCTURE_LINK && (!Memory.linkMap[struct.id] || 
                    (Memory.linkMap[struct.id] && !Memory.linkMap[struct.id].assignee))
            });
    
            if (links && links.length > 0) {
    
                for (let link of links) {
                    if (this.checkAssignLink(creep, link, "from")) {
                        break;
                    }
                    if (this.checkAssignLink(creep, link, "to")) {
                        break;
                    }
                }

                if (!creep.memory.linkTarget) {
                    //No valid links were found
                    return false;
                } 
            } else {
                //No available links...
                return false;
            }
        } 

        //Take action on link
        const link = Game.getObjectById(creep.memory.linkTarget.link);
        const container = Game.getObjectById(creep.memory.linkTarget.container);
        if (creep.memory.linkTarget.type === "from") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                let withdrawSuccess = creep.withdraw(container, RESOURCE_ENERGY);
                if (withdrawSuccess != OK) {
                    if (withdrawSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            } else {
                let transferSuccess = creep.transfer(link, RESOURCE_ENERGY);
                if (transferSuccess !== OK) {
                    if (transferSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(link);
                    }
                } 
            }
        } else if (creep.memory.linkTarget.type === "to") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                let withdrawSuccess = creep.withdraw(link, RESOURCE_ENERGY);
                if (withdrawSuccess !== OK) {
                    creep.moveTo(link);
                }
            } else {
                let transferSuccess = creep.transfer(container, RESOURCE_ENERGY);
                if (transferSuccess !== OK) {
                    if (transferSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        } else {
            console.log(`${creep.name} has a bad linkTarget...`);
        } 
       
        return true;
    }

    checkAssignLink(creep, link, type) {

        if (!Memory.linkMap[link.id]) {
            let structures = link.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (struct) => struct.structureType === (type === "from" ? STRUCTURE_CONTAINER : STRUCTURE_STORAGE)
            });
            if (structures && structures.length > 0) {
                Memory.linkMap[link.id] = {assignee: creep.name, type: type, structId: structures[0].id};
                creep.memory.linkTarget = {link: link.id, container: structures[0].id, type: type};
                return true;
            }
        } else {
            Memory.linkMap[link.id].assignee = creep.name;
            creep.memory.linkTarget = {link: link.id, container: Memory.linkMap[link.id].container, type: type};
            return true;
        }
       
        return false;
    }
};
