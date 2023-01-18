const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  s3BucketName: "grucloud-terraform-globalnetwork-state-file-storage",
  dynamoDBTableName: "terraform-state-locking",
  includeGroups: ["DynamoDB", "S3"],
});
