const { pipe, assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { AwsDistribution, compareDistribution } = require("./AwsDistribution");

const GROUP = "CloudFront";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "CloudFrontDistribution",
      dependsOn: ["Certificate", "S3Bucket"],
      Client: AwsDistribution,
      isOurMinion,
      compare: compareDistribution,
    },
  ]);
