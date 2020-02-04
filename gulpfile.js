var defaultTasks = require('./gulp/tasks/default');
var deployTasks = require('./gulp/tasks/deploy');

exports.default = defaultTasks.default;

module.exports.clean = deployTasks.clean;
module.exports.cleanAndBuild = deployTasks.cleanAndBuild;
module.exports.deploy = deployTasks.deploy;