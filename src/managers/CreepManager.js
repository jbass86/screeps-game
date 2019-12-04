"use strict";

const DynamicCreepConfig = require("DynamicCreepConfig");
const dynamicConfig = new DynamicCreepConfig();

module.exports = class CreepManager {

    constructor() {}
    
    cullCreepMemory() {
        
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
    
    createCreepRoleMap (room) {
        
        let roles = {};
        
        for (let creep of Object.values(Game.creeps)) {
            if (creep.memory.originRoom === room.name) {
                if (!roles[creep.memory.roleName]) {
                    roles[creep.memory.roleName] = 1;
                } else {
                    roles[creep.memory.roleName]++;
                }
            }  
        }
        
        return roles;
    }
    
    replenishCreeps() {

        for (let room of Object.values(Game.rooms)) {

            const spawns = room.find(FIND_MY_SPAWNS);

            if (spawns && spawns.length >= 1) {

                for (let spawn of spawns) {
                    const availableCreeps = this.createCreepRoleMap(room);
            
                    for (let roleName of dynamicConfig.getPriorityList()) {
        
                        let roleConfig = dynamicConfig.getCreepConfig(roleName, room);
                        if (roleConfig.numToHave && (!availableCreeps[roleName]  || availableCreeps[roleName] < roleConfig.numToHave)) {
                            if (this.createCreep(spawn, roleConfig)) {
                                //We made a creep successfully
                                break;
                            } 
                        }
                    }
                }
            }
        }
    }
    
    createCreep(spawn, role) {
        
        let parts = this.determineParts(spawn, role);

        if (parts) {

            const newName = this.createCreepName(role.name);
            let creepMemory = {
                roleName: role.roleName,
                role: role.role,
                originRoom: spawn.room.name
            };

            spawn.spawnCreep(parts, newName, {memory: creepMemory});
            console.log(`Successfully spawned ${newName} with role ${role.roleName} and parts ${parts}`);
            return true;
        } else {
            console.log("I couldn't spawn creep with role " + role.role); 
            return false;
        }
    }

    determineParts(spawn, role) {

        const partsArray = [...role.baseParts];

        //Check to see if base parts is possible first
        if (spawn.spawnCreep(partsArray, "TestCreepy", {dryRun: true}) !== OK) {
            return null;
        }

        //We can at least make the base creep, lets see how many segments we can add to it.
        let numSegments = 0;
        while ((!role.maxSegments || numSegments < role.maxSegments) && spawn.spawnCreep([...partsArray, ...role.segment], "TestCreepy", {dryRun: true}) === OK) {
            partsArray.push(...role.segment);
            numSegments++;
        }
        return partsArray;
    }
    
    createCreepName(role) {
        return role + Math.round(Math.random() * 1000);
    }
};