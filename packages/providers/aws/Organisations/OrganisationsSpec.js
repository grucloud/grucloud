const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");

const { OrganisationsOrganisation } = require("./OrganisationsOrganisation");

const GROUP = "Organisations";

const compareOrganisations = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Organisation",
      dependencies: {},
      Client: OrganisationsOrganisation,
      omitProperties: ["Arn", "Id", "MasterAccountArn", "MasterAccountId"],
      inferName: get("properties.MasterAccountEmail"),
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
