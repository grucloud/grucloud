const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["ACM", "CloudFront", "Route53", "Route53Domains", "S3"],
});
