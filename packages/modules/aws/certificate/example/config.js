const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "example-module-aws-certificate.grucloud.org",
  },
  projectName: pkg.name,
});
