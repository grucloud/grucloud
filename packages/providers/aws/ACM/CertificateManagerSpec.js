const { isOurMinion } = require("../AwsCommon");

const { AwsCertificate } = require("./AwsCertificate");

module.exports = [
  {
    type: "Certificate",
    Client: AwsCertificate,
    isOurMinion,
  },
];
