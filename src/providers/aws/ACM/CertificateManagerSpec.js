const assert = require("assert");

const logger = require("../../../logger")({ prefix: "AwsRoute53Spec" });
const { tos } = require("../../../tos");
const { isOurMinion } = require("../AwsCommon");

const { AwsCertificate } = require("./AwsCertificate");

module.exports = [
  {
    type: "Certificate",
    Client: ({ spec, config }) => AwsCertificate({ spec, config }),
    isOurMinion,
  },
];
