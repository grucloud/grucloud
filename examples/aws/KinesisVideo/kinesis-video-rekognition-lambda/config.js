const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["IAM", "KinesisVideo", "Lambda","Rekognition", "S3","SNS"],

});