const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["DocDBElastic", "EC2", "IAM"],
});
