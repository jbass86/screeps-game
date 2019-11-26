

module.exports = {
    run(tower){
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (t) => global.Friends[t.owner.username] == undefined
        });
        if(target != undefined)
        {
            tower.attack(target);
        }
        else {
            /*var dmgStruct = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType != STRUCTURE_WALL &&
                                s.structureType != STRUCTURE_RAMPART &&
                                s.hits < s.hitsMax
            });
            if(dmgStruct != undefined){
                tower.repair(dmgStruct);
            }
            else {*/
                var dmgWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (w) => (w.structureType == STRUCTURE_RAMPART) &&
                                    w.hits < 50000
                });
                if(!dmgWall)
                {
                    dmgWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (w) => (w.structureType == STRUCTURE_WALL ||
                                        w.structureType == STRUCTURE_RAMPART) &&
                                        w.hits < 50000
                    });
                }
                tower.repair(dmgWall);
            //}
        }
    }
};