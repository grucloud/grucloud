const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  certificate: {
    rootDomainName: undefined,
    domainName: undefined,
  },
  projectName: pkg.name,
});
