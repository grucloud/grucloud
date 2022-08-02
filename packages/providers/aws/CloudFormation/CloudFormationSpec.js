const assert = require("assert");
const { pipe, tap, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const {} = require("@grucloud/core/Common");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { CloudFormationStack } = require("./CloudFormationStack");

const GROUP = "CloudFormation";
const compareCloudFormation = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Stack",
      dependencies: {
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("RoleARN"),
        },
      },
      Client: CloudFormationStack,
      isOurMinion,
      ignoreResource: () => () => true,
      compare: compareCloudFormation({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: ({ lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  ],
  map(defaultsDeep({ group: GROUP })),
]);
