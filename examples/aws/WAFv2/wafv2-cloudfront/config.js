const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["ACM", "CloudFront", "WAFv2"],
});
