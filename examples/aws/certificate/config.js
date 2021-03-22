const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  DomainName: "grucloud.org",
  projectName: pkg.name,
});
