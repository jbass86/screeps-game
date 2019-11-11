
const screepsCredentials = require("./credentials.json");

module.exports = function(grunt) {
 
    grunt.loadNpmTasks("grunt-screeps");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-clean")
 
    grunt.initConfig({

        clean: {
            folder: ["dist/"]
        },

        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['src/**'], dest: 'dist/', filter: 'isFile'}
                ]
            }
        },

        jshint: {
            files: {
                src: ["src/**/*.js"]
            }
        },

        screeps: {
            options: {
                email: screepsCredentials.email,
                password: screepsCredentials.password,
                branch: "default",
                ptr: false
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "dist/",
                        src: ["*.{js,wasm}"]
                    }
                ]
            }
        }
    });

    grunt.registerTask("default", ["clean", "copy"]);
    grunt.registerTask("deploy", ["clean", "copy", "screeps"]);
}