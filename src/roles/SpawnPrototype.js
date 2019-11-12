/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('SpawnPrototype');
 * mod.thing == 'a thing'; // true
 */

module.exports = function() {
    StructureSpawn.prototype.createCustomCreep = 
        function(energy, roleName, bodySequence) {
			var numberOfParts = Math.floor(energy / 200);
			var body = [];
            for(let i = 0; i < numberOfParts; i++)
            {
                body = body.concat(bodySequence);
            }
            return this.createCreep(body, undefined, {role: roleName, working: false});
        }
};