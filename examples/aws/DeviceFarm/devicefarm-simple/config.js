const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["DeviceFarm", "EC2", "IAM"],
  region: "us-west-2",
});
