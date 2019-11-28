"use strict";

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

const MinerRole = require("MinerRole");
const miner = new MinerRole();

const TransporterRole = require("TransporterRole");
const transporter = new TransporterRole();

const LinkerRole = require("LinkerRole");
const linker = new LinkerRole();

const roleMap = {
    "harvester": harvester,
    "upgrader": upgrader,
    "builder": builder,
    "maintainer": maintainer,
    "wallguy": maintainer,
    "miner": miner,
    "transporter": transporter,
    "linker": linker
};

module.exports = class CreepHandler {

    constructor() {}

    handleCreepManagement() {
        if (Game.time % 60 === 0){
            manager.cullCreepMemory();
            manager.replenishCreeps(manager.createCreepRoleMap());
        }
    }

    run() {
        this.handleCreepManagement();
        
        for (let creep of Object.values(Game.creeps)) {
            if (creep.my && !creep.spawning){
                
                const roleAttr = creep.memory.primaryRole || creep.memory.role;
               
                if (roleAttr) {
                    
                    //if the role of a creep is an array then run through it until a role can be performed...
                    if (Array.isArray(roleAttr)) {
                        
                        for (let role of roleAttr) {
                            if (roleMap[role] && roleMap[role].run(creep, role)) {
                                //successfully ran a role so we're done...
                                break;
                            }
                        }
                    } else if (roleMap[roleAttr]) {
                        roleMap[roleAttr].run(creep, roleAttr);
                    }
                   
                } else {
                    console.log(`Creep ${creep.name} does not appear to have a role`);
                }
            } 
        }
    }
};