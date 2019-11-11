//Bass Screeps
//Another comment

"use strict";

const Friends = {
    "Kpow": {name: "Kpow", status: "closeFriend"}
};

const CreepManager = require("CreepManager");
const manager = new CreepManager();

const HarvesterRole = require("HarvesterRole");
const harvester = new HarvesterRole();

const UpgraderRole = require("UpgraderRole");
const upgrader = new UpgraderRole();

const BuilderRole = require("BuilderRole");
const builder = new BuilderRole();

const MaintainerRole = require("MaintainerRole");
const maintainer = new MaintainerRole();

const roleMap = {
    "harvester": harvester,
    "upgrader": upgrader,
    "builder": builder,
    "maintainer": maintainer
}


class MainApp {
    
    handleCreepManagement() {
        manager.cullCreepMemory();
        manager.replenishCreeps(manager.createCreepRoleMap());
    }
    
    loop() {
        
        this.handleCreepManagement();
        
        for (let creep of Object.values(Game.creeps)) {
            if (creep.my && !creep.spawning){
                
                const roleAttr = creep.memory.primaryRole || creep.memory.role;
               
                if (roleAttr) {
                    
                    //if the role of a creep is an array then run through it until a role can be performed...
                    if (Array.isArray(roleAttr)) {
                        
                        for (let role of roleAttr) {
                            if (roleMap[role] && roleMap[role].run(creep)) {
                                //successfully ran a role so we're done...
                                break;
                            }
                        }
                    } else if (roleMap[roleAttr]) {
                        roleMap[roleAttr].run(creep);
                    }
                   
                } else {
                    console.log(`Creep ${creep.name} does not appear to have a role`);
                }
            } 
        }
       
    }
}

module.exports = new MainApp();
