var harvester = require('Harvester');
var upgrader = require('Upgrader');
var builder = require('Builder');
var repairer = require('Repairer');
var transporter = require('Transporter');
var miner = require('Miner');
var linkMiner = require('LinkMiner');
var longRangeHarvester = require('LongRangeHarvester');

module.exports = {
    runCreeps() {
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
            else if (creep.memory.role == "longRangeHarvester") {
                longRangeHarvester.run(creep);
            }
        }
    }

}