const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["ACM", "CloudFront", "S3", "WAFv2"],
});
