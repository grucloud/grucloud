const assert = require("assert");
const { map, pipe, tap, get, omit } = require("rubico");
const { defaultsDeep, isEmpty, isDeepEqual } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const {
  Inspector2DelegatedAdminAccount,
} = require("./Inspector2DelegatedAdminAccount");
const { Inspector2Enabler } = require("./Inspector2Enabler");
const {
  Inspector2OrganizationConfiguration,
} = require("./Inspector2OrganizationConfiguration");

const GROUP = "Inspector2";

const tagsKey = "Tags";

const compareInspector2 = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "DelegatedAdminAccount",
      Client: Inspector2DelegatedAdminAccount,
      inferName: () => () => "default",
      omitProperties: ["status", "delegatedAdminAccountId"],
      dependencies: {
        account: {
          type: "Account",
          group: "Organisations",
          dependencyId: () => pipe([get("delegatedAdminAccountId")]),
        },
      },
    },
    {
      type: "Enabler",
      Client: Inspector2Enabler,
      ignoreResource: () => pipe([get("live.resourceTypes"), isEmpty]),
      inferName: () => () => "default",
      compare: compareInspector2({
        filterAll: () => pipe([omit(["accountIds"])]),
      }),
      omitProperties: ["state"],
    },
    {
      type: "OrganizationConfiguration",
      Client: Inspector2OrganizationConfiguration,
      inferName: () => () => "default",
      omitProperties: ["maxAccountLimitReached"],
      ignoreResource: () =>
        pipe([
          get("live"),
          get("autoEnable"),
          (autoEnable) =>
            isDeepEqual(autoEnable, {
              ec2: false,
              ecr: false,
            }),
        ]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compareInspector2({}),
    })
  ),
]);
