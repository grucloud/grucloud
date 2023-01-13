const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  credentials: { profile: "regionB" },
  includeGroups: ["S3", "S3Control"],
});
