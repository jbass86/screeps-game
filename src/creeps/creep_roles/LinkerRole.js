"use strict";

const BaseRole = require("BaseRole");


module.exports = class LinkerRole extends BaseRole {

    constructor() {
        super();
    }

    run (/*creep*/) {
        return true;
    }
};
