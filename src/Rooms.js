
module.exports = {
    run(){
        let myRooms = _.filter(Game.rooms, function(r) {return (r.controller.owner && r.controller.owner.username == "Kpow")})

        for(myRoom of myRooms){
            let roomSpawns = _.filter(Game.spawns, function (s) {return s.room.name == myRoom.name})
            console.log(roomSpawns);
            let printPos = 6;
            for(currentRole in global.RoleInfo)
            {
                let roleObj = global.RoleInfo[currentRole];
                var numRole = _.sum(Game.creeps, (c) => c.memory.role == roleObj.name);
                myRoom.visual.text(currentRole + ": " + numRole + " / " + roleObj.max[myRoom.name], 4, printPos, {color: numRole < roleObj.max ? "#ff3333" : "#ffffff"});
                printPos++;
                console.log(currentRole);
            }
        }
    }
}