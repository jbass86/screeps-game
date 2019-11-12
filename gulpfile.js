"use strict";

const { src, dest, parallel, series } = require('gulp');

const credentials = require("./credentials.json");

const del = require("del");
const flatten = require("gulp-flatten");
const gulpScreeps = require("gulp-screeps");

function clean(cb) {
    (async () => {
        const deletedPaths = await del(['dist']);
        console.log('Deleted files and directories:\n', deletedPaths.join('\n'));
        cb();
    })();
};

function copy(cb) {
    src("src/**/*.js").pipe(flatten()).pipe(dest("dist/"));
    cb();
};

function screeps(cb) {

    const options = {
        token: credentials.apiKey,
        branch: "default",
        ptr: false
    };
    src("src/**/*.js").pipe(flatten()).pipe(dest("dist/")).pipe(gulpScreeps(options));
    cb();
};

exports.clean = clean;
exports.copy = copy;
exports.screeps = screeps;
exports.build = series(clean, copy);
exports.deploy = series(clean, screeps);