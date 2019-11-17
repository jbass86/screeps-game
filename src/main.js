require('SpawnPrototype')();
var creeps = require('Creeps');
var tower = require('Tower');
var rooms = require('Rooms');

global.Friends = {
    jbass86: {name: "jbass86", status: "closeFriend"},
    Nate954: {name: "Nate954", status: "closeFriend"}
 };

global.RoleInfo = {
    Harvester: {name: "harvester", bodySequence: [CARRY,CARRY,MOVE], max: {E39S33: 1}, segments: 3, crossRoom: false},
    Transporter: {name: "transporter", bodySequence: [CARRY,CARRY,MOVE], max: {E39S33: 1}, segments: 3, crossRoom: false},
    Miner: {name: "miner", bodySequence:[WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], max: {E39S33: 1}, segments: 3, crossRoom: false},
    LinkMiner: {name: "linkMiner", bodySequence: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], max: {E39S33: 1}, segments: 3, crossRoom: false},
    LongRangeHarvester: {name: "longRangeHarvester", bodySequence: [WORK, CARRY,CARRY,MOVE,MOVE, MOVE], max: {E39S33: 1}, segments: 3, crossRoom: true},
    Reserver: {name: "reserver", bodySequence:  [CLAIM, MOVE], max: {E39S33: 1}, segments: 3, crossRoom: true},
    Repairer: {name: "repairer", bodySequence: [CARRY,CARRY,MOVE], max: {E39S33: 1}, segments: 3, crossRoom: false},
    Builder: {name: "builder", bodySequence: [WORK, CARRY, MOVE], max: {E39S33: 2}, segments: 0, crossRoom: false},
    Upgrader: {name: "upgrader", bodySequence: [WORK, CARRY, MOVE], max: {E39S33: 1}, segments: 3, crossRoom: false}
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
    
    var minHarvesters = 1;
	var minBuilders = 2;
	var minRepairer = 1;
	var minTransporters = 1;
	var minMiners = 1;
	var minLinkMiners = 1;
    var maxUpgrader = 1;
    var minLrHarvester = 1;
    var minReserver = 1;
    var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
	var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
	var numRepairer = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
	var numTransporters = _.sum(Game.creeps, (c) => c.memory.role == 'transporter');
	var numMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
	var numLinkMiners = _.sum(Game.creeps, (c) => c.memory.role == 'linkMiner');
    var numUpgrader = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numLrHarvester = _.sum(Game.creeps, (c) => c.memory.role == 'longRangeHarvester');
    var numReserver = _.sum(Game.creeps, (c) => c.memory.role == 'reserver');

    var role = undefined
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var energyPerSequence = 200;
	var bodySequence = [WORK, CARRY, MOVE];
    if(numHarvesters < minHarvesters)
    {
        role = 'harvester';
        bodySequence = [CARRY, CARRY, MOVE];
        energyPerSequence = 150;
        energy = 450;
    }
	else if (numTransporters < minTransporters) {
		role = 'transporter';
        bodySequence = [CARRY, CARRY, MOVE];
        energyPerSequence = 150;
		energy = 300;
	}
	else if (numMiners < minMiners) {
		role = 'miner';
		bodySequence = [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
        energy = 550;
        energyPerSequence = 650;
    }
    else if (numLinkMiners < minLinkMiners)
    {
        role = 'linkMiner';
		bodySequence = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE];
        energyPerSequence = 700;
		energy = 700;
    }
    else if (numLrHarvester < minLrHarvester)
    {
        role = 'longRangeHarvester';
        bodySequence = [WORK, CARRY,CARRY,MOVE,MOVE, MOVE];
        energyPerSequence = 350;
    }
    else if (numReserver < minReserver)
    {
        role = 'reserver';
        bodySequence = [CLAIM, MOVE];
        energyPerSequence = 650;
        energy = 650;
    }
	else if (numRepairer < minRepairer) {
		role = 'repairer';
        bodySequence = [CARRY, CARRY, MOVE];
        energyPerSequence = 150;
		energy = 300;
	}
    else if(numBuilders < minBuilders)
    {
        role = 'builder';
	}
    else if (numUpgrader < maxUpgrader)
    {
        role = 'upgrader';
    }
    
    if(role)
    {
        var name = Game.spawns.Spawn1.createCustomCreep(energy, role, bodySequence, energyPerSequence);
        if(name == ERR_NOT_ENOUGH_ENERGY && (numHarvesters == 0 || numTransporters == 0 || numMiners == 0))
        {
            Game.spawns.Spawn1.createEmergencyCreep(numHarvesters, numMiners, numLinkMiners, numTransporters);
        }
    }
	console.log("End Tick");
}