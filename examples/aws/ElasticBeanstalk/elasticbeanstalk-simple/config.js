const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["EC2", "ElasticBeanstalk", "IAM", "S3"],
});
