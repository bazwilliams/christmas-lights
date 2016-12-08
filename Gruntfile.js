module.exports = function (grunt) {

  // Define a zip task
  grunt.initConfig({
    zip: {
      lambda: {
        cwd: 'server/ChristmasLightsService/src/Service/bin/Debug/netcoreapp1.0/publish/',
        src: ['./server/ChristmasLightsService/src/Service/bin/Debug/netcoreapp1.0/publish/*'],
	dest: 'build/release/it-christmas-tree.zip'
      }
    }
  });

  // Load in `grunt-zip`
  grunt.loadNpmTasks('grunt-zip');
};
