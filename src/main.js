require('SpawnPrototype')();
var harvester = require('Harvester');
var upgrader = require('Upgrader');
var builder = require('Builder');
var repairer = require('Repairer');
var transporter = require('Transporter');
var miner = require('Miner');
var linkMiner = require('LinkMiner');
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
    for ( let name in Game.creeps)
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == "harvester")
        {
            harvester.run(creep);
        }
        else if(creep.memory.role == "upgrader")
        {
            upgrader.run(creep);
        }
        else if(creep.memory.role == "builder")
        {
            builder.run(creep);
		}
		else if (creep.memory.role == "repairer") {
			repairer.run(creep);
		}
		else if (creep.memory.role == "miner") {
			miner.run(creep);
		}
		else if (creep.memory.role == "transporter") {
			transporter.run(creep);
		}
		else if (creep.memory.role == "linkMiner") {
			linkMiner.run(creep);
		}
    }
    
    tower.run();
    
    var minHarvesters = 2;
	var minBuilders = 2;
	var minRepairer = 1;
	var minTransporters = 1;
	var minMiners = 1;
	var minLinkMiners = 1;
    var maxUpgrader = 2;
    var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
	var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
	var numRepairer = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
	var numTransporters = _.sum(Game.creeps, (c) => c.memory.role == 'transporter');
	var numMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
	var numLinkMiners = _.sum(Game.creeps, (c) => c.memory.role == 'linkMiner');
    var numUpgrader = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
	
	console.log("num of harvesters: " + numHarvesters);
	console.log("num of miners: " + numMiners);
    console.log("num of linkMiners: " + numLinkMiners);
	console.log("num of transporters: " + numTransporters);
	console.log("num of repairers: " + numRepairer);
	console.log("num of builders: " + numBuilders);
    console.log("num of upgraders: " + numUpgrader);
    
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
            if (numTransporters < minTransporters) {
                role = 'transporter';
                bodySequence = [CARRY, CARRY, MOVE];
                energyPerSequence = 150;
                energy = 450;
                energy = Math.min(Game.spawns.Spawn1.room.energyAvailable, 450);
            }
            else if(numHarvesters == 0)
            {
                role = 'harvester';
                bodySequence = [CARRY, CARRY, MOVE];
                energyPerSequence = 150;
                energy = Math.min(Game.spawns.Spawn1.room.energyAvailable, 450);
            }
            else if (numMiners < minMiners) {
                role = 'miner';
                bodySequence = [WORK,WORK,MOVE];
                energyPerSequence = 250;
                energy = Game.spawns.Spawn1.room.energyAvailable;
            }
            name = Game.spawns.Spawn1.createCustomCreep(energy, role, bodySequence, energyPerSequence);
        }
    }
	console.log("End Tick");
}