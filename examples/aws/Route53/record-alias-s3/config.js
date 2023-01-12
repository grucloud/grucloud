const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["Route53", "Route53Domains", "S3"],
});
