const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudFormation",
    "Organisations",
    "ServiceCatalog",
    "S3",
    "SSM",
  ],
});
