const { pipe, assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");

const { AwsCertificate } = require("./AwsCertificate");

const GROUP = "acm";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Certificate",
      Client: AwsCertificate,
      isOurMinion,
    },
  ]);
