"use strict";

const BaseRole = require("BaseRole");


module.exports = class LinkerRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {

        Game.time % 10 === 0 ? this.cullStructureMap("usedLinks") : null;

        if (!creep.linkTarget) {
            let links = creep.room.find(FIND_STRUCTURES, {
                filter: (struct) => struct.id === STRUCTURE_LINK && !Memory.usedLinks[struct.id]
            });
    
            if (links && links.length > 0) {
    
                for (let link of links) {
                    if (this.checkAssignLink(creep, link, "to")) {
                        break;
                    }
                    if (this.checkAssignLink(creep, link, "from")) {
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
        if (creep.memory.linkTarget.type === "to") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                let withdrawSuccess = creep.withdraw(container);
                if (withdrawSuccess != OK) {
                    if (withdrawSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            } else {
                let transferSuccess = creep.transfer(link);
                if (transferSuccess === OK) {
                    //It was successfull check the link see if we should xfer...
                    let fromLink = this.findFromLink();
                    if (fromLink) {
                        link.transfer(Game.getObjectById(fromLink));
                    }
                } else {
                    if (transferSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(link);
                    }
                } 
            }
        } else if (creep.memory.linkTarget.type === "from") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                let withdrawSuccess = creep.withdraw(link);
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
        let structures = link.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (struct) => struct.structureType === (type === "to" ? STRUCTURE_CONTAINER : STRUCTURE_STORAGE)
        });
        if (structures && structures.length > 0) {
            Memory.usedLinks[link.id] = {asignee: creep.name, type: type, structId: structures[0].id};
            creep.memory.linkTarget = {link: link.id, container: structures[0].id, type: type};
            return true;
        }
        return false;
    }

    findFromLink() {
        for (let entry of Object.entries(Memory.usedLinks)) {
            if (entry[1].type === "from") {
                return entry[0];
            }
        }
    }
};
