const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { OrganisationsRoot } = require("./OrganisationsRoot");

const { OrganisationsOrganisation } = require("./OrganisationsOrganisation");
const {
  OrganisationsOrganisationalUnit,
} = require("./OrganisationsOrganisationalUnit");

const GROUP = "Organisations";

const compareOrganisations = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Root",
      Client: OrganisationsRoot,
      omitProperties: ["Arn", "Id"],
      inferName: get("properties.Name"),
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
      omitProperties: ["Id", "Arn"],
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
