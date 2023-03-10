const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["APIGateway", "IAM", "Kinesis", "Lambda", "QLDB"],
});
