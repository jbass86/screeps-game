

module.exports = class CreepKiller {


    run(tower) {

        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (creep) => global.Friends[creep.owner.username]
        });

        if(target){
            tower.attack(target);
            return true;
        } else {
            return false;
        }
    }
}