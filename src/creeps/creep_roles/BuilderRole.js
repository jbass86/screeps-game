"use strict";

//Builder Routine

const BaseRole = require("BaseRole");

module.exports =  class BuilderRoutine extends BaseRole {
    
    run(creep) {
        
        if (creep.memory.canBuild) {

            if (creep.store[RESOURCE_ENERGY] > 0) {

                if (!creep.memory.buildTarget) {

                    const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

                    if (constructionSite) {
                        creep.memory.buildTarget = constructionSite.id;
                    } else {
                        //There is no site to build so we cannot perform this role...
                        return false;
                    }
                }

                const constructionSite = Game.getObjectById(creep.memory.buildTarget);
                let buildSuccess = creep.build(constructionSite);
                if (buildSuccess !== OK) {
                    if(buildSuccess === ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite, {maxRooms:1});
                    } else {
                        //Something else is wrong just drop the target
                        delete creep.memory.buildTarget;
                    }
                } 
            } else {
                creep.memory.canBuild = false;
            }

        } else {
            this.gather(creep, RESOURCE_ENERGY);

            if (creep.store.getFreeCapacity() === 0) {
                creep.memory.canBuild = true;
            }
        }
        return true;
    }
};