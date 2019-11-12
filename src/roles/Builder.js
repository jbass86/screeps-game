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
        if(creep.memory.working) 
        {
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(constructionSite != undefined)
            {
                if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    //console.log(creep.name + " moving from " + creep.pos + " to " + constructionSite.pos);
                    creep.moveTo(constructionSite, {maxRooms:1});
                }
                if(creep.carry.energy == 0)
                {
                    creep.memory.working = false;
                }
            }
            else
            {
                upgrader.run(creep);
            }
        }
        else
        {
			var source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (s) => s.energy > 0 });
            //console.log(creep.name + " found source at " + source.energyCapacity);
            if( source != undefined && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {maxRooms:1});
            }
            if(creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.working = true;
            }
        }
    }

};