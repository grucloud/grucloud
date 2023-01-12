const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  credentials: { profile: "regionA" },
  includeGroups: ["S3", "S3Control"],
});
