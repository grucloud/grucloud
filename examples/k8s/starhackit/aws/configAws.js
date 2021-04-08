const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.projectName,
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "starhackit.grucloud.org",
  },
  eks: { cluster: { name: `cluster-${pkg.projectName}-${stage}` } },
});
