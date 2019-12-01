"use strict";


const LinkHandler = require("LinkHandler");
const link = new LinkHandler();

module.exports = class StructureHandler {

    constructor() {}

    run() {

        for (let room of Object.values(Game.rooms)) {
            link.run(room);
        }
    }
};