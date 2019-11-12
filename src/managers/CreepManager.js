

//explorer? defender? 
const roleConfig = {
    "harvester": {name: "Harvester", role: "harvester", numToHave : 6, parts: [WORK, CARRY, MOVE]},
    "upgrader": {name: "Upgrader", role: "upgrader", numToHave : 2, parts: [WORK, CARRY, MOVE]},
    "builder": {name: "Builder", role: ["builder", "upgrader"], numToHave : 4, parts: [WORK, CARRY, MOVE]},
    "maintainer": {name: "Maintainer", role: ["maintainer", "harvester"], numToHave : 2, parts: [WORK, CARRY, MOVE]}
}

module.exports = class CreepManager {

    constructor() {
        
    }
    
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
        const success = spawn.spawnCreep(role.parts, newName);
                
        if (success === OK) {
            Game.creeps[newName].memory.role = role.role;
        } else {
            console.log("I couldn't spawn creep with role " + role.role + " because of code " + success);
        }
        return success;
    }
    
    createCreepName(role) {
        return role + Math.round(Math.random() * 1000);
    }
};