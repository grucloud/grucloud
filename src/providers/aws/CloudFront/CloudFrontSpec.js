const { isOurMinion } = require("../AwsCommon");
const { AwsDistribution, compareDistribution } = require("./AwsDistribution");

module.exports = [
  {
    type: "CloudFrontDistribution",
    dependsOn: ["Certificate"],
    Client: ({ spec, config }) => AwsDistribution({ spec, config }),
    isOurMinion,
    compare: compareDistribution,
  },
];
