require('SpawnPrototype')();
var harvester = require('Harvester');
var upgrader = require('Upgrader');
var builder = require('Builder');
var repairer = require('Repairer');
var transporter = require('Transporter');

const Friends = {
   jbass86: {name: "jbass86", status: "closeFriend"}
};

module.exports.loop = function () {
    for (let name in Memory.creeps)
    {
		if (Game.creeps[name] == undefined) {
			if (Memory.creeps[name].hasOwnProperty("container")) {
				console.log("Clean up this container " + Memory.creeps[name].container);
				Memory.containers[Memory.creeps[name].container].transporter = false;
			}
            delete Memory.creeps[name];
        }
    }
    for ( let name in Game.creeps)
    {
        var creep = Game.creeps[name];
        //console.log(creep.name + " Has " + creep.ticksToLive + " time to live and is a " + creep.memory.role);
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
		else if (creep.memory.role == "transporter") {
			transporter.run(creep);
		}
    }
    
    var towers = Game.rooms.E39S33.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for(let tower of towers)
    {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (t) => Friends[t.owner.username] == undefined
        });
        if(target != undefined)
        {
            tower.attack(target);
        }
    }
    
    var minHarvesters = 3;
	var minBuilders = 3;
	var minRepairer = 2;
	var minTransporters = 2;
    var maxUpgrader = 4;
    var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
	var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
	var numRepairer = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
	var numTransporters = _.sum(Game.creeps, (c) => c.memory.role == 'transporter');
    var numUpgrader = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    console.log("num of harvesters: " + numHarvesters);
	console.log("num of builders: " + numBuilders);
	console.log("num of repairers: " + numRepairer);
	console.log("num of transporters: " + numTransporters);
    console.log("num of upgraders: " + numUpgrader);
    
    var role = undefined
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
	var bodySequence = [WORK, CARRY, MOVE];
    if(numHarvesters < minHarvesters)
    {
        role = 'harvester';
        
    }
    else if(numBuilders < minBuilders)
    {
        role = 'builder';
	}
	else if (numRepairer < minRepairer) {
		role = 'repairer';
	}
	else if (numTransporters < minTransporters) {
		role = 'transporter';
		bodySequence = [CARRY, CARRY, MOVE];
		energy = energy / 2;
	}
    else
    {
        role = 'upgrader';
    }
    
	var name = Game.spawns.Spawn1.createCustomCreep(energy, role, bodySequence);
	console.log(name);
    if(name == ERR_NOT_ENOUGH_ENERGY && numHarvesters == 0)
    {
        name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, role, bodySequence);
    }
}