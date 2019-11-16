require('SpawnPrototype')();
var creeps = require('Creeps');
var tower = require('Tower');


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

    Game.spawns["Spawn1"].room.visual.text("Harvesters: " + numHarvesters + " / " + minHarvesters, 4, 6, {color: numHarvesters < minHarvesters ? "#ff3333" : "#ffffff"});
    Game.spawns["Spawn1"].room.visual.text("TowerTransports: " + numRepairer + " / " + minRepairer, 4, 7, {color: numRepairer < minRepairer ? "#ff3333" : "#ffffff"});
    Game.spawns["Spawn1"].room.visual.text("Builders: " + numBuilders + " / " + minBuilders, 4, 8, {color: numBuilders < minBuilders ? "#ff3333" : "#ffffff"});
    Game.spawns["Spawn1"].room.visual.text("Miners: " + numMiners + " / " + minMiners, 4, 9, {color: numMiners < minMiners ? "#ff3333" : "#ffffff"});
    Game.spawns["Spawn1"].room.visual.text("Transporters: " + numTransporters + " / " + minTransporters, 4, 10, {color: numTransporters < minTransporters ? "#ff3333" : "#ffffff"});
    Game.spawns["Spawn1"].room.visual.text("LinkMiners: " + numLinkMiners + " / " + minLinkMiners, 4, 11, {color: numLinkMiners < minLinkMiners ? "#ff3333" : "#ffffff"});
    Game.spawns["Spawn1"].room.visual.text("Upgraders: " + numUpgrader + " / " + maxUpgrader, 4, 12, {color: numUpgrader < maxUpgrader ? "#ff3333" : "#ffffff"});
    Game.spawns["Spawn1"].room.visual.text("LrHarvester: " + numLrHarvester + " / " + minLrHarvester, 4, 13, {color: numLrHarvester < minLrHarvester ? "#ff3333" : "#ffffff"});
    Game.spawns["Spawn1"].room.visual.text("Reserver: " + numReserver + " / " + minReserver, 4, 14, {color: numReserver < minReserver ? "#ff3333" : "#ffffff"});
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
        energyPerSequence = 550;
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