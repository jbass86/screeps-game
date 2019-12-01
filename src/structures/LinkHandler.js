"use strict";


module.exports = class LinkHandler {

    constructor() {}

    run(room) {

        if (Game.time % 10 !== 0) {
            return;
        }
        
        let links = room.find(FIND_STRUCTURES, {
            filter: (struct) => struct.structureType === STRUCTURE_LINK && Memory.linkMap[struct.id]
        });
        
        let toLink = null;
        let fromLinks = [];

        for (let link of links) {
            if (Memory.linkMap[link.id].type === "to") {
                toLink = link;
            } else {
                fromLinks.push(link);
            }
        }

        if (toLink && fromLinks.length > 0) {
            for (let link of fromLinks) {
                if (toLink.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                    let transferSuccess = link.transferEnergy(toLink);
                    console.log(`Attempted to xfer from link ${link.id} to link ${toLink.id} with result of ${transferSuccess}`);
                }
            }
        }
    }
};