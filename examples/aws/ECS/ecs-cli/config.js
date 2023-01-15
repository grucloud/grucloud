const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["AutoScaling", "EC2", "ECS"],
});
