"use strict";
 
const rolePriority = ["harvester", "miner",  "linker", "transporter", "upgrader", "builder", "maintainer", "wallguy"];

const roleConfig = {
    "miner": {
        name: "Miner", 
        role: "miner", 
        baseParts: [MOVE, WORK],
        segment: [WORK],
        maxSegments: 4
    },
    "transporter": {
        name: "Transporter", 
        role: ["transporter", "harvester", "upgrader"], 
        baseParts: [WORK, CARRY, MOVE], 
        segment: [WORK, CARRY, MOVE],
    },
    "linker": {
        name: "LinkDude", 
        role: "linker", 
        baseParts: [CARRY, MOVE],
        segment: [CARRY],
        maxSegments: 2
    },
    "harvester": {
        name: "Harvester", 
        role: ["harvester", "upgrader"], 
        baseParts: [WORK, CARRY, MOVE],
        segment: [WORK, CARRY, MOVE]
    },
    "upgrader": {
        name: "Upgrader", 
        role: "upgrader", 
        baseParts: [WORK, CARRY, MOVE],
        segment: [WORK, CARRY, MOVE]
    },
    "builder": {
        name: "Builder", 
        role: ["builder", "maintainer", "upgrader"], 
        baseParts: [WORK, CARRY, MOVE],
        segment: [WORK, CARRY, MOVE]
    },
    "maintainer": {
        name: "Maintainer", 
        role: ["maintainer", "harvester", "upgrader"], 
        baseParts: [WORK, CARRY, MOVE],
        segment: [WORK, CARRY, MOVE]
    },
    "wallguy": {
        name: "WallGuy", 
        role: ["wallguy", "upgrader"], 
        baseParts: [WORK, CARRY, MOVE],
        segment: [WORK, CARRY, MOVE]
    }
};

module.exports = class DynamicCreepConfig {

    constructor() {}

    getPriorityList() {
        return rolePriority;
    }

    getCreepConfig(roleName, room) {

        if (roleConfig[roleName]) {
            let configObj = Object.assign({}, roleConfig[roleName]);
            configObj.roleName = roleName;
            configObj.numToHave = this.getNumCreeps(roleName, room);
            return configObj;
        }
        
        return null;
    }

    getNumCreeps(roleName, room) {

        let numToHave = 0;

        if (room.controller && room.controller.my) {
            if (roleName === "miner") {
                numToHave = this._getNumMiners(room);
            } else if (roleName === "transporter") {
                numToHave = this._getNumTransporters(room);
            } else if (roleName === "linker") {
                numToHave = this._getNumLinkers(room);
            } else if (roleName === "harvester") {
                numToHave = this._getNumHarvesters(room);
            } else if (roleName === "upgrader") {
                numToHave = this._getNumUpgraders(room);
            } else if (roleName === "maintainer") {
                numToHave = this._getNumMaintainers(room);
            } else if (roleName === "wallguy") {
                numToHave = this._getNumWallGuys(room);
            } else if (roleName === "builder") {
                numToHave = this._getNumBuilders(room);
            }
        }
        return numToHave;
    }

    _getNumMiners(room) {
        
        let num = 0;
       
        //Need to figure out how many drop mine containers are in the room
        let containers =  room.find(FIND_STRUCTURES, {filter: (struct) => struct.structureType === STRUCTURE_CONTAINER});

        if (containers) {
            for (let container of containers) {
                if (Memory.usedContainers[container.id] && Memory.usedContainers[container.id] !== "INVALID") {
                    num++;
                } else if (Memory.usedContainers[container.id] === "INVALID") {
                    //This isnt a drop mine container skip it...
                    continue;
                } else {
                    //Not in the map but could still be a drop mine container we need to check...
                    let energy = container.pos.findInRange(FIND_SOURCES, 1);
                    if (energy && energy.length >= 1) {
                        num++;
                    }
                }
            }
        }
        return num;
    }

    _getNumTransporters(room) {

        let num = 0;

        if (room.controller.level >= 4) { 
            //Just a transporter for each miner at this time...
            num = this._getNumMiners(room);
        }
        return num;
    }

    _getNumLinkers(room) {
        let num = 0;

        if (room.controller.level >= 5) { 
            
            //Just return say we'll make a linker for each available link structure for now...
            let links = room.find(FIND_STRUCTURES, {filter: (struct) => struct.structureType === STRUCTURE_LINK});
            if (links && links.length > 0) {
                num = links.length;
            }
        }
        return num;
    }

    _getNumHarvesters(room) {

        let num = 0;

        if (room.controller.level <= 3) { 

            let energySources = room.find(FIND_SOURCES);

            if (energySources && energySources.length > 0) {
                num = energySources.length * 2;
            } 
        } else {
            //Placeholder... its what I currently have..
            num = 4;
        }

        return num;
    }

    _getNumUpgraders(room) {

        if (room.controller.level >= 4) {
            return 2;
        } else {
            return 4;
        }
    }

    _getNumMaintainers(room) {
        let num = 0;

        if (room.controller.level >= 2) {
            let structures = room.find(FIND_STRUCTURES);
            num = Math.min(1, Math.round(structures.length / 100));
        }
       
        return num;
    }

    _getNumWallGuys(room) {

        let num = 0;

        if (room.controller.level >= 2) {
            let walls = room.find(STRUCTURE_WALL);
            if (walls && walls.length > 1) {
                num = Math.min(1, Math.round(walls.length / 25));
            }
        } 

        return num;
    }

    _getNumBuilders(room) {

        let num = 0;

        let numSites = room.find(FIND_CONSTRUCTION_SITES);
        if (numSites && numSites.length > 0) {
            num = Math.min(1, Math.round(numSites.length / 5));
        }

        return num;
    }
};