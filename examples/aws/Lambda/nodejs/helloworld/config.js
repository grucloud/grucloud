const pkg = require("./package.json");
module.exports = ({ stage, region }) => ({
  projectName: pkg.name,
  includeGroups: ["Lambda"],
});
