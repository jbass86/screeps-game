"use strict";

const { src, dest, parallel, series } = require('gulp');

const del = require("del");
const flatten = require("gulp-flatten");
const gulpScreeps = require("gulp-screeps");
const eslint = require("gulp-eslint");

const minimist = require("minimist");
const args = minimist(process.argv.slice(2));

let credentials;
try {
    credentials = require("./credentials.json");
} catch (err) {
    console.error(
        "-----------------------WARNING--------------------------\n",
        "It appears that your crendentials.json couldnt be loaded\n", 
        "You cannot publish to the screeps server without it \n",
        "and therefore the 'gulp deploy' job will fail...\n",
        "Create the file in this format {'apiKey': <YOUR API KEY>}\n",
        "-----------------------------------------------------------"
    );
}

function clean(cb) {
    (async () => {
        const deletedPaths = await del(['dist']);
        console.log('Deleted files and directories:\n', deletedPaths.join('\n'));
        cb();
    })();
};

function lint(cb) {
    return src("src/**/*.js").pipe(eslint({rules: {strict: 2}})).pipe(eslint.format()).pipe(eslint.failAfterError());
}

function lintfix(cb) {
    return src("src/**/*.js").pipe(eslint({fix: true, rules: {strict: 2}})).pipe(eslint.format()).pipe(dest("src/"));
}

function copy(cb) {
    return src("src/**/*.js").pipe(flatten()).pipe(dest("dist/"));
};

function screeps(cb) {

    if (!credentials) {
        console.log("No credentials cant run...");
        cb();
        return false;
    }

    const options = {
        token: credentials.apiKey,
        branch: args.branch || "default",
        ptr: false
    };
    return src("dist/*.js").pipe(gulpScreeps(options));
};

exports.clean = clean;
exports.lint = lint;
exports.lintfix = lintfix;
exports.copy = copy;
exports.screeps = screeps;
exports.build = series(parallel(clean, lint), copy);
exports.deploy = series(parallel(clean, lint), copy, screeps);