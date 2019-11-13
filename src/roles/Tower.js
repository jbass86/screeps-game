
const Friends = {
    jbass86: {name: "jbass86", status: "closeFriend"}
 };
module.exports = {
    run(){
        var towers = Game.rooms.E39S33.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        });
        for(let tower of towers)
        {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (t) => Friends[t.owner.username] == undefined
            });
            if(target != undefined)
            {
                tower.attack(target);
            }
            else {
                var dmgStruct = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType != STRUCTURE_WALL &&
                                   s.structureType != STRUCTURE_RAMPART &&
                                   s.hits < s.hitsMax
                });
                if(dmgStruct != undefined){
                    tower.repair(dmgStruct);
                }
                else {
                    var dmgWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (w) => (w.structureType == STRUCTURE_WALL ||
                                        w.structureType == STRUCTURE_RAMPART) &&
                                        w.hits < w.hitsMax*0.00001
                    });
                    tower.repair(dmgWall);
                }
            }
        }
    }
};