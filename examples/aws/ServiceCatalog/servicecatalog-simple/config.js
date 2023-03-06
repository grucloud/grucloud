const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudFormation", "ServiceCatalog", "S3"],
});
