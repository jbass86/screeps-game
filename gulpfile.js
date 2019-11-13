"use strict";

const { src, dest, parallel, series } = require('gulp');

const credentials = require("./credentials.json");

const del = require("del");
const flatten = require("gulp-flatten");
const gulpScreeps = require("gulp-screeps");
const eslint = require("gulp-eslint");

function clean(cb) {
    (async () => {
        const deletedPaths = await del(['dist']);
        console.log('Deleted files and directories:\n', deletedPaths.join('\n'));
        cb();
    })();
};

function lint(cb) {
    return src("src/**/*.js").pipe(eslint({fix: true, rules: {strict: 2}})).pipe(eslint.format()).pipe(eslint.failAfterError());
}

function copy(cb) {
    return src("src/**/*.js").pipe(flatten()).pipe(dest("dist/"));
};

function screeps(cb) {

    const options = {
        token: credentials.apiKey,
        branch: "default",
        ptr: false
    };
    //src("src/**/*.js").pipe(flatten()).pipe(dest("dist/")).pipe(gulpScreeps(options));
    return src("dist/*.js").pipe(gulpScreeps(options));
};

exports.clean = clean;
exports.lint = lint;
exports.copy = copy;
exports.screeps = screeps;
exports.build = series(clean, lint, copy);
exports.deploy = series(clean, lint, copy, screeps);