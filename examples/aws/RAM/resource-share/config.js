const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  accountDev: "548529576214",
  includeGroups: ["EC2", "Organisations", "RAM"],
});
