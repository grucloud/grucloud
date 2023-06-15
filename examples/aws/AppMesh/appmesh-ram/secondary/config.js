const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["AppMesh", "RAM"],
  credentials: { profile: "account_secondary" },
  region: "us-east-2",
});
