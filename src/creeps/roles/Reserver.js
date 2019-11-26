
module.exports = {
    run(creep) {
        //creep.say("Reserver!");
        if(!creep.memory["home"]){
            creep.memory.home = creep.room.storage.id;
            let exit = Game.getObjectById(creep.memory.home).pos.findClosestByPath(FIND_EXIT);
            creep.memory.exit = exit;
        }
        if(creep.room == Game.getObjectById(creep.memory.home).room)
        {
            creep.moveTo(creep.memory.exit.x, creep.memory.exit.y, {ignoreCreeps: false});
        }
        else {
            
            if(creep.reserveController( creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller, {ignoreCreeps: false});
            }
        }
    }
};