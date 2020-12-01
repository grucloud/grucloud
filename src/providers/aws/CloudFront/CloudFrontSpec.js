const { isOurMinion } = require("../AwsCommon");
const { AwsDistribution, compareDistribution } = require("./AwsDistribution");

module.exports = [
  {
    type: "CloudFrontDistribution",
    Client: ({ spec, config }) => AwsDistribution({ spec, config }),
    isOurMinion,
    compare: compareDistribution,
  },
];
