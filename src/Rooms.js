
var tower = require('Tower');

module.exports = {
    checkSpawnCreeps(myRoom, roleInfo, isEmergency){
        let roomSpawns = _.filter(Game.spawns, function (s) {return s.room.name == myRoom.name && !s.spawning});
        let name = undefined;
        let createdCreep = false;
        for(let currentRole in roleInfo)
        {
            let roleObj = roleInfo[currentRole];
            var numRole = _.sum(Game.creeps, (c) => c.memory.role == roleObj.name && c.memory.homeRoom == myRoom.name);

            if(numRole < roleObj.roomInfo[myRoom.name].max || roleObj.roomInfo[myRoom.name].max == -1 ){
                for(let roomSpawn of roomSpawns) {
                    segmentCost = 0;
                    for(let part of roleObj.bodySequence)
                    {
                        segmentCost += BODYPART_COST[part];
                    }
                    var energy = myRoom.energyCapacityAvailable;
                    if(roleObj.roomInfo[myRoom.name].segments > 0 && roleObj.roomInfo[myRoom.name].segments * segmentCost < energy){
                        energy = roleObj.roomInfo[myRoom.name].segments * segmentCost;
                    }
                    if(isEmergency){
                        energy = Math.min(energy, myRoom.energyAvailable);
                    }
                    name = roomSpawn.createCustomCreep(energy, roleObj.name, roleObj.bodySequence, segmentCost, roleObj.roomInfo[myRoom.name]["crossRoom"] || roleObj.crossRoom);
                    if(typeof name == 'string'){
                        let index = roomSpawns.indexOf(roomSpawn);
                        if(index > -1){
                            console.log("splicing spawn array");
                            roomSpawns.splice(index,1);
                        }
                        createdCreep = true;
                        numRole++;
                        break;
                    }
                    else if (name == ERR_NOT_ENOUGH_ENERGY){
                        return createdCreep;
                    }
                }
            }
        }
        return createdCreep;
    },

    run(){
        let myRooms = _.filter(Game.rooms, function(r) {return (r.controller["owner"] && r.controller.owner.username == "Kpow")})

        for(let myRoom of myRooms){
            let printPos = 39;
            for(let currentRole in global.RoleInfo)
            {
                let roleObj = global.RoleInfo[currentRole];
                var numRole = _.sum(Game.creeps, (c) => c.memory.role == roleObj.name && c.memory.homeRoom == myRoom.name);
                myRoom.visual.text(currentRole + ": " + numRole + " / " + roleObj.roomInfo[myRoom.name].max, 43, printPos, 
                                {color: numRole < roleObj.roomInfo[myRoom.name].max ? "#ff3333" : "#ffffff"});
                printPos++;
            }

            let createdCreep = this.checkSpawnCreeps(myRoom, global.RoleInfo);
            
            if(!createdCreep){
                let checkEmergencyRoles = false;
                for(let currentRole in global.EmergencyRoleInfo){
                    let roleObj = global.EmergencyRoleInfo[currentRole];
                    var numRole = _.sum(Game.creeps, (c) => c.memory.role == roleObj.name && c.memory.homeRoom == myRoom.name);
                    checkEmergencyRoles |= (numRole == 0 && roleObj.roomInfo[myRoom.name].max != 0);                 
                }
                if(checkEmergencyRoles){
                    this.checkSpawnCreeps(myRoom, global.EmergencyRoleInfo, true);
                }
            }

            
            var towers = myRoom.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_TOWER
            });
            for(let myTower of towers)
            {
                tower.run(myTower);
            }
        }
    }
}