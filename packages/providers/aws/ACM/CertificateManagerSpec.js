const { pipe, assign, map, omit, pick, get, eq, and } = require("rubico");
const { isEmpty, identity, first, when, size } = require("rubico/x");
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
        filterLive: pipe([pick(["DomainName"])]),
      }),
      ignoreResource: ({ lives }) => pipe([get("usedBy"), isEmpty]),
      filterLive: () =>
        pipe([
          pick(["DomainName", "SubjectAlternativeNames"]),
          when(
            ({ DomainName, SubjectAlternativeNames }) =>
              pipe([
                () => SubjectAlternativeNames,
                and([eq(size, 1), pipe([first, eq(identity, DomainName)])]),
              ])(),
            omit(["SubjectAlternativeNames"])
          ),
          omit(["DomainName"]),
        ]),
    },
  ]);
