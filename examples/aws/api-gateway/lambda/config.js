const pkg = require("./package.json");
module.exports = ({ stage, region }) => ({
  projectName: pkg.name,
  domainName: "grucloud.org",
  apigateway: { route: { name: "ANY /my-function" } },
});
