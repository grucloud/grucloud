const { pipe, assign, map, omit, pick, get, eq, and } = require("rubico");
const { isEmpty, identity, first, when, size } = require("rubico/x");
const { isOurMinion } = require("../AwsCommon");
const { compareAws } = require("../AwsCommon");

const { AwsCertificate } = require("./AwsCertificate");

const GROUP = "ACM";

const compareACM = compareAws({});

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Certificate",
      Client: AwsCertificate,
      isOurMinion,
      compare: compareACM({
        filterTarget: () => pipe([pick([])]),
        //TODO recreate
        filterLive: () => pipe([pick([])]),
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
