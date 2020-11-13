const assert = require("assert");

const logger = require("../../../logger")({ prefix: "AwsRoute53Spec" });
const { tos } = require("../../../tos");
const { isOurMinion } = require("../AwsCommon");

const { AwsHostedZone } = require("./AwsHostedZone");

module.exports = [
  {
    type: "HostedZone",
    Client: ({ spec, config }) => AwsHostedZone({ spec, config }),
    isOurMinion,
  },
];
