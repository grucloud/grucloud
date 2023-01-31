const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  //includeGroups: ["AppRunner", "EC2", "IAM"],
});
