"use strict";

//Bass Screeps
//Main Entry point of my screeps colony management.

global.Friends = {
    "Kpow": {name: "Kpow", status: "closeFriend"}
};

const CreepHandler = require("CreepHandler");
const creeps = new CreepHandler();

const TowerHandler = require("TowerHandler");
const towers = new TowerHandler();

class MainApp {
    
    loop() {    
        creeps.run();
        towers.run();
    }
}

module.exports = new MainApp();
