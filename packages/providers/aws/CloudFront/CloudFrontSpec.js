const { pipe, assign, map, pick } = require("rubico");
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
      filterLive: () =>
        pick([
          "PriceClass",
          "Aliases",
          "DefaultRootObject",
          "DefaultCacheBehavior",
          "Origins",
          "Restrictions",
          "Comment",
          "Logging",
        ]),
      dependencies: () => ({
        bucket: { type: "Bucket", group: "S3" },
        certificate: { type: "Certificate", group: "ACM" },
      }),
    },
  ]);
