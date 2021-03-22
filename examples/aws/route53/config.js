const pkg = require("./package.json");
module.exports = () => ({
  topLevelDomain: "grucloud.org",
  domainName: "route53test.grucloud.org",
  projectName: pkg.name,
});
