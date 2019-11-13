

module.exports = class CreepKiller {


    run(tower) {

        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (creep) => Friends[creep.owner.username] === undefined
        });

        if(target){
            tower.attack(target);
            return true;
        } else {
            return false;
        }
    }
}