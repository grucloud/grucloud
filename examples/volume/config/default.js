const pkg = require("../package.json");
module.exports = () => ({
  //region: "eu-west-2",
  //zone: "eu-west-2a",
  projectName: pkg.name,
});
