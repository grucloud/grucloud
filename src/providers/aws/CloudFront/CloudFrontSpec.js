const assert = require("assert");

const logger = require("../../../logger")({ prefix: "AwsCloudFrontSpec" });
const { tos } = require("../../../tos");
const { isOurMinion } = require("../AwsCommon");

const { AwsDistribution } = require("./AwsDistribution");

module.exports = [
  {
    type: "CloudFrontDistribution",
    Client: ({ spec, config }) => AwsDistribution({ spec, config }),
    isOurMinion,
  },
];
