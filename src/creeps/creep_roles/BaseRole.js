"use strict";


const gatherTypes = {
    "ground": {name: "ground", type: "item"},
    "tombstone": {name: "tombstone", type: "item"},  
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

module.exports = class BaseRole {

    constructor() {}

    /**
     * Gather Energy for a creep from some available source.
     * @param {*} creep The creep to work on
     * @param {*} resource The resource to gather (default: Energy)
     * @param {*} priority An array of object for the gather priority (Will default to defaultPriority)
     */
    gather(creep, resource, priority) {

        let resourceType = resource || RESOURCE_ENERGY;
        let priorityList = priority || defaultPriority;
        
        if(creep.store.getFreeCapacity(resourceType) > 0) {
    
            if (!creep.memory.gatherTarget) {
                for (let gatherType of priorityList) {
                    if (gatherTypes[gatherType.name]) {
                        const target = this.findTarget(creep, resourceType, gatherType.style, gatherTypes[gatherType.name]);
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
                    gatherSuccess = creep.withdraw(target, resourceType);
                } else if (creep.memory.gatherTarget.type === "node") {
                    gatherSuccess = creep.harvest(target);
                }
                
                
                if (gatherSuccess !== OK) {
                    creep.memory.gatherTarget.elapsedTicks++;
                    
                    if(gatherSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                    } else if (gatherSuccess === ERR_NOT_ENOUGH_RESOURCES || 
                        gatherSuccess === ERR_INVALID_TARGET){
                        //Its empty or invalid find something else...
                        delete creep.memory.gatherTarget;
                        return true;
                    } else {     
                        console.log("Unexpected Gather Error " + gatherSuccess);
                        delete creep.memory.gatherTarget;
                        return true;
                    }
                    
                    if (creep.memory.gatherTarget.elapsedTicks > 100) {
                        creep.say("give up");
                        delete creep.memory.gatherTarget;
                    }
                }
            }

            return true;
        } else {
            delete creep.memory.gatherTarget;
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

        let target = null;
    
        if (style === "closest") {
          
            if (data.type === "item") {

                if (data.name === "ground") {
                    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                        filter: (item) => item.resourceType === resource
                    });
                } else if (data.name === "tombstone") {
                    target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                        filter: (item) => item.resourceType === resource
                    });
                }               
            } else if (data.type === "structure") {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (struct) => struct.structureType === data.id && struct.store.getUsedCapacity(resource) > 0
                });
            } else if (data.type === "node") {
                target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            }
           
        } else if (style === "most") {
            
            if (data.type === "item") {

                if (data.name === "ground") {
                    const targets = target = creep.room.find(FIND_DROPPED_RESOURCES, {
                        filter: (item) => item.resourceType === resource
                    });
    
                    if (targets && targets.length > 0) {
                        targets.sort((a, b) => b.amount - a.amount);
                        target = targets[0];
                    }
                } else if (data.name === "tombstone") {
                    const targets = target = creep.room.find(FIND_TOMBSTONES, {
                        filter: (item) => item.resourceType === resource
                    });
    
                    if (targets && targets.length > 0) {
                        targets.sort((a, b) => b.store.getUsedCapacity(resource) - a.store.getUsedCapacity(resource));
                        target = targets[0];
                    }
                }
                
            } else if (data.type === "structure") {

                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (struct) => struct.structureType === data.id && struct.store.getUsedCapacity(resource) > 0
                });
                if (targets && targets.length > 0) {
                    targets.sort((a, b) => b.store.getUsedCapacity(resource) - a.store.getUsedCapacity(resource));
                    target = targets[0];
                }
               
            } else if (data.type === "node") {
                //This needs to support minerals and Deposits still....
                const targets = creep.room.find(FIND_SOURCES_ACTIVE);
                if (targets && targets.length > 0) {
                    targets.sort((a, b) => b.energy - a.energy);
                    target = targets[0];
                }
            }
        } else {
            console.log("unknown gather style " + style);
        }
        
        return target;
    }


    cullStructureMap(name) {

        for (let entry of Object.entries(Memory[name])) {
            if (entry[1] && entry[1] !== "INVALID") {    
                const creepLives = Game.creeps[entry[1]];
                if (!creepLives){
                    Memory[name][entry[0]] = false;
                }
            }
        }
    }
};