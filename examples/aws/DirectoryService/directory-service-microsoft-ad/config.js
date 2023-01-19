const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["DirectoryService", "EC2", "Organisations"],
});
