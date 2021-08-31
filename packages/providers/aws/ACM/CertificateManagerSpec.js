const { pipe, assign, map, omit } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

const { AwsCertificate } = require("./AwsCertificate");

const GROUP = "ACM";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Certificate",
      Client: AwsCertificate,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["ValidationMethod", "Tags"])]),
      }),
    },
  ]);
