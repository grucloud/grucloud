const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  location: "uksouth",
});
