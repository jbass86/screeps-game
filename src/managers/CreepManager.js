

//explorer? defender? 
const roleConfig = {
    "harvester": {
        name: "Harvester", 
        role: ["harvester", "upgrader"], 
        numToHave : 6, 
        parts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        minParts: 3
    },
    "upgrader": {
        name: "Upgrader", 
        role: "upgrader", 
        numToHave : 2, 
        parts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        minParts: 3
    },
    "builder": {
        name: "Builder", 
        role: ["builder", "upgrader"], 
        numToHave : 4, 
        parts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        minParts: 3
    },
    "maintainer": {
        name: "Maintainer", 
        role: ["maintainer", "harvester", "upgrader"], 
        numToHave : 2, 
        parts: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        minParts: 3
    }
};

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
    
    createCreepRoleMap () {
        
        let roles = {};
        
        for (let creep of Object.values(Game.creeps)) {
            if (!roles[creep.memory.role]) {
                roles[creep.memory.role] = 1;
            } else {
                roles[creep.memory.role]++;
            }
        }
        
        return roles;
    }
    
    replenishCreeps(availableCreeps) {

        for (let spawn of Object.values(Game.spawns)) {
            for (let role of Object.values(roleConfig)) {
                if (!availableCreeps[role.role] || availableCreeps[role.role] < role.numToHave) {
                    let createSuccess = this.createCreep(spawn, role);
                    if (createSuccess === ERR_BUSY) {
                        return;
                    }
                }
            }
        }
        
    }
    
    createCreep(spawn, role) {
        
        const newName = this.createCreepName(role.name)
        let parts = [...role.parts];

        let success = false;

        while (parts.length > role.minParts) {

            success = spawn.spawnCreep(parts, newName);
                
            if (success === OK) {
                Game.creeps[newName].memory.role = role.role;
                console.log(`Successfully spawned ${newName} with role ${role.role} and parts ${parts}`);
                break;
            } else if (success === ERR_NOT_ENOUGH_ENERGY){
                console.log(`Not enough enery to make parts ${parts} try again with one less part`);
                parts.pop();
            } else {
                console.log("I couldn't spawn creep with role " + role.role + " because of code " + success);
                break;
            }
        }
      
        return success;
    }
    
    createCreepName(role) {
        return role + Math.round(Math.random() * 1000);
    }
};