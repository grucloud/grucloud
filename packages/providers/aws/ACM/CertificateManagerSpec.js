const assert = require("assert");
const {
  pipe,
  tap,
  assign,
  map,
  omit,
  pick,
  get,
  eq,
  and,
  switchCase,
} = require("rubico");
const {
  isEmpty,
  identity,
  first,
  when,
  size,
  callProp,
  last,
} = require("rubico/x");
const fs = require("fs");

const { isOurMinion } = require("../AwsCommon");
const { compareAws } = require("../AwsCommon");

const {
  AwsCertificate,
  getCommonNameFromCertificate,
} = require("./AwsCertificate");

const GROUP = "ACM";

const compareACM = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Certificate",
      Client: AwsCertificate,
      isOurMinion,
      compare: compareACM({
        filterTarget: () => pipe([pick([])]),
        //TODO recreate
        filterLive: () => pipe([pick([])]),
      }),
      ignoreResource: ({ lives }) => pipe([get("live.InUseBy"), isEmpty]),
      inferName: pipe([
        get("properties"),
        switchCase([
          get("certificateFile"),
          pipe([
            get("certificateFile"),
            (certificateFile) => fs.readFileSync(certificateFile, "utf-8"),
            getCommonNameFromCertificate,
            tap((CN) => {
              assert(CN);
            }),
          ]),
          pipe([
            get("DomainName"),
            tap((DomainName) => {
              assert(DomainName);
            }),
          ]),
        ]),
      ]),
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
        ]),
    },
  ],
  map(assign({ group: () => GROUP })),
]);
