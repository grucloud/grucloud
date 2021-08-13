const pkg = require("./package.json");
module.exports = ({ stage, region }) => ({
  projectName: pkg.name,
  domainName: "grucloud.org",
  apiGatewayV2: { route: { name: "ANY /my-function" } },
});
