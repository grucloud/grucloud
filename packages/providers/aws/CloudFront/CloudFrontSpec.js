const { pipe, assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { AwsDistribution, compareDistribution } = require("./AwsDistribution");

const GROUP = "CloudFront";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Distribution",
      dependsOn: ["ACM::Certificate", "S3::Bucket"],
      Client: AwsDistribution,
      isOurMinion,
      compare: compareDistribution,
    },
  ]);
