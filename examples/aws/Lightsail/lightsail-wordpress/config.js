const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["Lightsail", "Route53", "Route53Domains"],
});
