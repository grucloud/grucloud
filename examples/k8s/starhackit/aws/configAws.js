const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "starhackit.grucloud.org",
  },
  eks: { cluster: { name: `${cluster}-${stage}` } },
});
