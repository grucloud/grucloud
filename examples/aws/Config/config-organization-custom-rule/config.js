const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["Config", "Lambda", "Organisations", "S3"],
});
