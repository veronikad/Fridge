module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json")
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("heroku", ["default"]);
};