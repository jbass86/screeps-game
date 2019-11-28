"use strict";

const BaseRole = require("BaseRole");

if (!Memory.usedLinks) {
    Memory.usedLinks = {};
}

module.exports = class LinkerRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {

        Game.time % 10 === 0 ? this.cullStructureMap("usedLinks") : null;

        //TODO might want to make a separate class to just handle link transferring...
        Game.time % 10 === 0 ? this.checkTransferResources() : null;

        if (!creep.memory.linkTarget) {
            let links = creep.room.find(FIND_STRUCTURES, {
                filter: (struct) => struct.structureType === STRUCTURE_LINK && !Memory.usedLinks[struct.id]
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
        let structures = link.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (struct) => struct.structureType === (type === "from" ? STRUCTURE_CONTAINER : STRUCTURE_STORAGE)
        });
        if (structures && structures.length > 0) {
            Memory.usedLinks[link.id] = {asignee: creep.name, type: type, structId: structures[0].id};
            creep.memory.linkTarget = {link: link.id, container: structures[0].id, type: type};
            return true;
        }
        return false;
    }

    findLink(type) {
        for (let entry of Object.entries(Memory.usedLinks)) {
            if (entry[1].type === type ? type : "to") {
                return entry[0];
            }
        }
    }

    checkTransferResources() {
        
        let fromLink = this.findLink("from");
        if (fromLink) {
            let link = Game.getObjectById(fromLink);
            if (link.store.getFreeCapacity() === 0) {
                let fromLink = this.findLink();
                if (fromLink) {
                    let transferSuccess = link.transferEnergy(Game.getObjectById(fromLink));
                    console.log("link to link xfer result " + transferSuccess);
                }
            }     
        }
        
    }
};
