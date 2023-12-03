const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["IAM"],
  // excludeGroups: [],
  credentials: { profile: "default" },
  partition: "aws",
});
