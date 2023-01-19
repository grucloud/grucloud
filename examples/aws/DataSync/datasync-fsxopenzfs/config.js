const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["DataSync", "EC2", "FSx", "S3"],
});
