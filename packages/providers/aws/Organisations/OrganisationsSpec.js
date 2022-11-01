const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { OrganisationsAccount } = require("./OrganisationsAccount");
const { OrganisationsPolicy } = require("./OrganisationsPolicy");
const {
  OrganisationsPolicyAttachment,
} = require("./OrganisationsPolicyAttachment");
const { OrganisationsOrganisation } = require("./OrganisationsOrganisation");
const {
  OrganisationsOrganisationalUnit,
} = require("./OrganisationsOrganisationalUnit");
const { OrganisationsRoot } = require("./OrganisationsRoot");

const GROUP = "Organisations";

const compareOrganisations = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Account",
      Client: OrganisationsAccount,
      omitProperties: [
        "Arn",
        "Id",
        "Status",
        "JoinedTimestamp",
        "JoinedMethod",
      ],
      inferName: get("properties.Name"),
    },
    {
      type: "Policy",
      Client: OrganisationsPolicy,
      omitProperties: ["Arn", "PolicyId", "AwsManaged"],
      inferName: get("properties.Name"),
    },
    {
      type: "PolicyAttachment",
      Client: OrganisationsPolicyAttachment,
      omitProperties: ["TargetId", "PolicyId", "Type", "Arn", "Name"],
      inferName: pipe([
        get("dependenciesSpec"),
        ({ policy, account, root, organisationalUnit }) =>
          `policy-attach::${policy}::${account || root || organisationalUnit}`,
      ]),
      dependencies: {
        policy: {
          type: "Policy",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("PolicyId"),
        },
        account: {
          type: "Account",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("TargetId"),
        },
        root: {
          type: "Root",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("TargetId"),
        },
        organisationalUnit: {
          type: "OrganisationalUnit",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("TargetId"),
        },
      },
    },
    {
      type: "Organisation",
      dependencies: {},
      Client: OrganisationsOrganisation,
      omitProperties: ["Arn", "Id", "MasterAccountArn", "MasterAccountId"],
      inferName: get("properties.MasterAccountEmail"),
    },
    {
      type: "OrganisationalUnit",
      dependencies: {
        root: {
          type: "Root",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("ParentId"),
        },
        organisationalUnitParent: {
          type: "OrganisationalUnit",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("ParentId"),
        },
      },
      Client: OrganisationsOrganisationalUnit,
      omitProperties: ["Id", "Arn", "ParentId"],
      inferName: get("properties.Name"),
    },
    {
      type: "Root",
      Client: OrganisationsRoot,
      omitProperties: ["Arn", "Id"],
      inferName: get("properties.Name"),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareOrganisations({}),
    })
  ),
]);
