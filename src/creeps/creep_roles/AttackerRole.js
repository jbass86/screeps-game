"use strict";

//Harvester Roule

const BaseRole = require("BaseRole");


module.exports = class AttackerRole extends BaseRole {

    constructor() {
        super();
    }

    run (creep) {
        
        if (!creep.memory.attackFlag) {
            this.findAttackFlag(creep);
        }

        if (creep.memory.attackFlag) {

            let attackFlag = Game.flags[creep.memory.attackFlag];

            if (attackFlag){
                if (creep.pos.roomName !== attackFlag.pos.roomName) {
                    creep.moveTo(attackFlag);
                } else {

                    if (!creep.memory.attackTarget) {
                        this.findAttackTarget(creep);
                    }
                    
                    if (creep.memory.attackTarget) {
                        let hostile = Game.getObjectById(creep.memory.attackTarget);
                        if (hostile) {
                            let attackSuccess = creep.attack(hostile);
                            if (attackSuccess === OK) { 
                                Game.time % 3 === 0 ? creep.say("DIE DIE!!", true) : null;
                            } else {
                                if (attackSuccess === ERR_NOT_IN_RANGE) {
                                    Game.time % 3 === 0 ? creep.say("KILL!!", true) : null;
                                    creep.moveTo(hostile);
                                } else {
                                    //Maybe its dead or it left the room?  Search for something else to fight
                                    delete creep.memory.attackTarget;
                                }
                            }
                        } else {
                            delete creep.memory.attackTarget;
                        }
                    } else {
                        console.log(`Attack creep ${creep.name} doesnt appear to have anything to attack in room ${creep.pos.roomName}`);
                        creep.moveTo(attackFlag);
                    }
                }
            }

            return true;
        } else {
            console.log(`Attack creep ${creep.name} doesnt seem to have anything to attack...`);
            return false;
        }
    }

    //TODO this is terrible logic to find an attack target, it needs to be alot better...
    findAttackTarget(creep) {

        let hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: (enemy) => !global.Friends[enemy.owner.username]});  
        if (!hostile) {
            hostile = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: (enemy) => !global.Friends[enemy.owner.username]});
        }

        if (hostile){
            creep.memory.attackTarget = hostile.id;
        }
    }

    findAttackFlag(creep) {

        let flags = (Object.values(Game.flags));

        for (let flag of flags) {
            let flagParts = flag.name.split("_");
            if (flagParts && flagParts.length === 3 && 
                flagParts[0] === "ATTACK" && 
                flagParts[2] === creep.memory.originRoom) {

                creep.memory.attackFlag = flag.name;
                break;
            }
        }
    }
};
