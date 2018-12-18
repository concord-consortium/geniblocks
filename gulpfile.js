var gulp        = require("gulp");
var HubRegistry = require("gulp-hub");

// Load main tasks in gulp/
var hub = new HubRegistry(["./gulp/default.js"]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);