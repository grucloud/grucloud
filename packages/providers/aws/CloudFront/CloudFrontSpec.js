const { pipe, assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { AwsDistribution, compareDistribution } = require("./AwsDistribution");

const GROUP = "cloudFront";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Distribution",
      dependsOn: ["Certificate", "S3Bucket"],
      Client: AwsDistribution,
      isOurMinion,
      compare: compareDistribution,
    },
  ]);
