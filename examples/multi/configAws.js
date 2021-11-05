const pkg = require("./package.json");
module.exports = ({ region }) => ({
  projectName: pkg.name,
  rootDomainName: "grucloud.org",
});
