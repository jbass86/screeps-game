"use strict";

//Bass Screeps
//Main Entry point of my screeps colony management.

global.Friends = {
    "Kpow": {name: "Kpow", status: "closeFriend"},
    "Nate954": {name: "Nate954", status: "closeFriend"}
};

const CreepHandler = require("CreepHandler");
const creeps = new CreepHandler();

const TowerHandler = require("TowerHandler");
const towers = new TowerHandler();

const StructureHandler = require("StructureHandler");
const structures = new StructureHandler();

class MainApp {
    
    loop() {    
        creeps.run();
        towers.run();
        structures.run();
    }
}

module.exports = new MainApp();
