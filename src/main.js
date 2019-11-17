require('SpawnPrototype')();
var creeps = require('Creeps');
var tower = require('Tower');
var rooms = require('Rooms');

global.Friends = {
    jbass86: {name: "jbass86", status: "closeFriend"},
    Nate954: {name: "Nate954", status: "closeFriend"}
 };

global.RoleInfo = {
    Harvester: {name: "harvester", bodySequence: [CARRY,CARRY,MOVE], roomInfo: {E39S33: {max: 1, segments: 3}}, crossRoom: false},
    Transporter: {name: "transporter", bodySequence: [CARRY,CARRY,MOVE], roomInfo: {E39S33: {max: 1, segments: 2}}, crossRoom: false},
    Miner: {name: "miner", bodySequence:[WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], roomInfo: {E39S33: {max: 1, segments: 1}}, crossRoom: false},
    LinkMiner: {name: "linkMiner", bodySequence: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], roomInfo: {E39S33: {max: 1, segments: 1}}, crossRoom: false},
    LongRangeHarvester: {name: "longRangeHarvester", bodySequence: [WORK, CARRY,CARRY,MOVE,MOVE, MOVE], roomInfo: {E39S33: {max: 1, segments: 0}}, crossRoom: true},
    Reserver: {name: "reserver", bodySequence:  [CLAIM, MOVE], roomInfo: {E39S33: {max: 1, segments: 1}}, crossRoom: true},
    Repairer: {name: "repairer", bodySequence: [CARRY,CARRY,MOVE], roomInfo: {E39S33: {max: 1, segments: 2}}, crossRoom: false},
    Builder: {name: "builder", bodySequence: [WORK, CARRY, MOVE], roomInfo: {E39S33: {max: 2, segments: 0}}, crossRoom: true},
    Upgrader: {name: "upgrader", bodySequence: [WORK, CARRY, MOVE], roomInfo: {E39S33: {max: 1, segments: 0}}, crossRoom: false}
}

global.EmergencyRoleInfo = {
    Harvester: {name: "harvester", bodySequence: [CARRY,CARRY,MOVE], roomInfo: {E39S33: {max: 1, segments: 0}}, crossRoom: false},
    Transporter: {name: "transporter", bodySequence: [CARRY,CARRY,MOVE], roomInfo: {E39S33: {max: 1, segments: 0}}, crossRoom: false},
    Miner: {name: "miner", bodySequence:[WORK,WORK,MOVE], roomInfo: {E39S33: {max: 1, segments: 0}}, crossRoom: false},
    LinkMiner: {name: "linkMiner", bodySequence: [WORK,WORK,MOVE], roomInfo: {E39S33: {max: 1, segments: 0}}, crossRoom: false}
}

module.exports.loop = function () {
    for (let name in Memory.creeps)
    {
		if (Game.creeps[name] == undefined) {
			if (Memory.creeps[name].hasOwnProperty("container")) {
				if (Memory.creeps[name].role == "transporter") {
					Memory.containers[Memory.creeps[name].container].transporter = false;
				}
				else {
					Memory.containers[Memory.creeps[name].container].miner = false;
				}

			}
            delete Memory.creeps[name];
        }
    }

    creeps.runCreeps();    
    tower.run();
    rooms.run();
    
	//console.log("End Tick");
}