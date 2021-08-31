const pkg = require("./package.json");

module.exports = ({ stage }) => ({
  projectName: pkg.name,
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "starhackit-eks-lbc.grucloud.org",
  },
  EKS: { cluster: { name: `cluster` } },
});
