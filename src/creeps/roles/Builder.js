/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Builder');
 * mod.thing == 'a thing'; // true
 */

var upgrader = require('Upgrader');

module.exports = {
    run(creep) {
        //creep.say("Builder!");
        creep.CheckState();
        if(creep.memory.working) 
        {
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(constructionSite != undefined)
            {
                if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite, {maxRooms:1, ignoreCreeps: false});
                }
            }
            else
            {
                let constructionSiteKeys = Object.keys(Game.constructionSites)
                if(creep.memory.crossRoom && constructionSiteKeys.length > 0){
                    creep.moveTo(Game.constructionSites[constructionSiteKeys[0]], {ignoreCreeps: false});
                }
                else {
                    upgrader.run(creep);
                }
            }
        }
        else
        {
            if(creep.room.name != creep.memory.homeRoom && !creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)){
                creep.moveTo(Game.rooms[creep.memory.homeRoom].storage, {ignoreCreeps: false});
            }
            creep.WithdrawEnergy();
        }
    }

};