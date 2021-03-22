const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  rootDomainName: "grucloud.org",
  domainName: "eks-module-test.grucloud.org",
  projectName: pkg.name,
});
