"use strict";


const gatherTypes = {
    "ground": {name: "ground", type: "item"},
    "tombstone": {name: "tombstone", type: "structure"},  
    "storage": {name: "storage", type: "structure", id: STRUCTURE_STORAGE}, 
    "container": {name: "container", type: "structure", id: STRUCTURE_CONTAINER}, 
    "node": {name: "node", type: "node"}
};

const defaultPriority = [  
    {name: "ground", style: "closest"}, 
    {name: "tombstone", style: "closest"},
    {name: "storage", style: "closest"}, 
    {name: "container", style: "most"}, 
    {name: "node", style: "most"}
];

if (!Memory.claimedPickups) {
    Memory.claimedPickups = {};
}

module.exports = class BaseRole {

    constructor() {}

    /**
     * Gather Energy for a creep from some available source.
     * @param {*} creep The creep to work on
     * @param {*} resource The resource to gather, undefined or null assumes gather anything...
     * @param {*} priority An array of object for the gather priority (Will default to defaultPriority)
     */
    gather(creep, resource, priority) {

        Game.time % 30 === 0 ? this.cullStructureMap("claimedPickups") : null;

        let priorityList = priority || defaultPriority;
        
        if(creep.store.getFreeCapacity(resource) > 0) {
    
            if (!creep.memory.gatherTarget) {
                for (let gatherType of priorityList) {
                    if (gatherTypes[gatherType.name]) {
                        const target = this.findTarget(creep, resource, gatherType.style, gatherTypes[gatherType.name]);
                        if (target) {
                            creep.memory.gatherTarget = {
                                id: target.id, 
                                elapsedTicks: 0,
                                type: gatherTypes[gatherType.name].type   
                            };
                            break;
                        }
                    }  
                }
            } 
            
            if (creep.memory.gatherTarget) {

                const target = Game.getObjectById(creep.memory.gatherTarget.id);        
                let gatherSuccess;
                
                if (creep.memory.gatherTarget.type === "item") {
                    gatherSuccess = creep.pickup(target);
                } else if (creep.memory.gatherTarget.type === "structure") {
                    if (!resource) {
                        //what to take wasnt specified so take anything thats in there...
                        let availResources = Object.keys(target.store);
                        this.gatherSuccess = availResources && availResources.length >= 1 ? 
                            creep.withdraw(availResources[0]) : ERR_INVALID_TARGET;
                    } else {
                        gatherSuccess = creep.withdraw(target, resource);
                    }
                   
                } else if (creep.memory.gatherTarget.type === "node") {
                    gatherSuccess = creep.harvest(target);
                }            
                
                if (gatherSuccess !== OK) {
                    creep.memory.gatherTarget.elapsedTicks++;
                    
                    if(gatherSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                    } else if (gatherSuccess === ERR_NOT_ENOUGH_RESOURCES || 
                        gatherSuccess === ERR_INVALID_TARGET) {
                        //Its empty or invalid find something else...
                        this.cleanupGatherTarget(creep);
                        return true;
                    } else {     
                        console.log("Unexpected Gather Error " + gatherSuccess);
                        this.cleanupGatherTarget(creep);
                        return true;
                    }
                    
                    if (creep.memory.gatherTarget.elapsedTicks > 100) {
                        creep.say("give up");
                        this.cleanupGatherTarget(creep);
                    }
                } 
            }

            return true;
        } else {
            this.cleanupGatherTarget(creep);
            return false;
        }
    }

    /**
     * 
     * @param {*} creep The creep in question
     * @param {*} resource The resource to find
     * @param {*} style The style in which to search
     * @param {*} data The data describing the search targets
     */
    findTarget(creep, resource, style, data) {

        const itemFilter = (item) => {
            let filter = true;
            if (resource) {
                filter &= item.resourceType === resource;
            }
            return filter && !Memory.claimedPickups[item.id];    
        };

        const structFilter = (struct) => {
            let filter = true;
            if (data.id) {
                filter &= struct.structureType === data.id;
            }
            return filter && struct.store.getUsedCapacity(resource) > 0 && !Memory.claimedPickups[struct.id];
        };

        let target = null;

        if (style === "closest") {
          
            if (data.type === "item") {

                if (data.name === "ground") {
                    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: itemFilter});
                }          
            } else if (data.type === "structure") {
                if (data.name === "tombstone") {
                    target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {filter: structFilter});
                } else {
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: structFilter});
                }                
            } else if (data.type === "node" && resource === RESOURCE_ENERGY) {
                target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            }
           
        } else if (style === "most") {
            
            if (data.type === "item") {

                if (data.name === "ground") {
                    const targets = target = creep.room.find(FIND_DROPPED_RESOURCES, {filter: itemFilter});
                    target = this.findLargestTarget(targets, resource, data.type);
                } 
                
            } else if (data.type === "structure") {
                if (data.name === "tombstone") {
                    const targets = target = creep.room.find(FIND_TOMBSTONES, {filter: structFilter});
                    target = this.findLargestTarget(targets, resource, data.type);
                } else {
                    const targets = creep.room.find(FIND_STRUCTURES, {filter: structFilter});
                    target = this.findLargestTarget(targets, resource, data.type);
                }   
            } else if (data.type === "node" && resource === RESOURCE_ENERGY) {
             
                const targets = creep.room.find(FIND_SOURCES_ACTIVE);
                if (targets && targets.length > 0) {
                    targets.sort((a, b) => b.energy - a.energy);
                    target = targets[0];
                }
            }
        } else {
            console.log("unknown gather style " + style);
        }

        if (target) {
            if ((data.type === "item" && creep.store.getFreeCapacity() >= target.amount) || 
                (data.type === "structure" && creep.store.getFreeCapacity() >= target.store.getUsedCapacity(resource))) {
                Memory.claimedPickups[target.id] = creep.name;
            }
        }
        
        return target;
    }

    cullClaimedPickups() {
        for (let key of Object.keys(Memory.claimedPickups)) {
            let gameObject = Game.getObjectById(key);
            if (!gameObject) {
                delete Memory.claimedPickups[key];
            }
        }
    }

    cullStructureMap(name) {

        for (let entry of Object.entries(Memory[name])) {

            let obj = Game.getObjectById(entry[0]);
            if (!obj) {
                delete Memory[name][entry[0]];
            } else {
                if (entry[1]) {
                    if (typeof entry[1] === "string") {
                        const creepLives = Game.creeps[entry[1]];
                        if (!creepLives){
                            Memory[name][entry[0]] = null;
                        }
                    } else if (typeof entry[1] === "object") {
                        const creepLives = Game.creeps[entry[1].assignee];
                        if (!creepLives){
                            Memory[name][entry[0]].assignee = null;
                        }
                    }
                } 
            }
        }
    }

    cleanupGatherTarget(creep) {
        if (creep.memory.gatherTarget){
            delete Memory.claimedPickups[creep.memory.gatherTarget.id];
            delete creep.memory.gatherTarget;
        }
    }

    findLargestTarget(targets, resource, type) {
        let ret = null;
        if (targets && targets.length > 0) {
            targets.sort((a, b) => {
                if (type === "item") {
                    return b.amount - a.amount;
                } else if (type === "structure") {
                    return b.store.getUsedCapacity(resource) - a.store.getUsedCapacity(resource);
                }  
            });
            ret = targets[0];
        }
        return ret;
    }
};