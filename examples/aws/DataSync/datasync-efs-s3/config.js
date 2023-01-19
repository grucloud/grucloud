const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["DataSync", "EC2", "EFS", "S3"],
});
