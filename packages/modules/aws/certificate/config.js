const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "eks-module-test.grucloud.org",
  },
  projectName: pkg.name,
});
