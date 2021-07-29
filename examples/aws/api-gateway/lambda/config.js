const pkg = require("./package.json");
module.exports = ({ stage, region }) => ({
  projectName: pkg.name,
  apigateway: { route: { name: "ANY /my-function" } },
});
