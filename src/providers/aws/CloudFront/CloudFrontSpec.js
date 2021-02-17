const { isOurMinion } = require("../AwsCommon");
const { AwsDistribution, compareDistribution } = require("./AwsDistribution");

module.exports = [
  {
    type: "CloudFrontDistribution",
    dependsOn: ["Certificate", "S3Bucket"],
    Client: AwsDistribution,
    isOurMinion,
    compare: compareDistribution,
  },
];
