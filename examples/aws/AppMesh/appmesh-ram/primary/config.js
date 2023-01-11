const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["AppMesh", "Organisations", "RAM"],
  credentials: { profile: "regionA" },
});
