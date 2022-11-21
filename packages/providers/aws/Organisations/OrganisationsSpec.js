const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

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
    OrganisationsAccount({}),
    OrganisationsPolicy({}),
    OrganisationsPolicyAttachment({}),
    OrganisationsOrganisation({}),
    OrganisationsOrganisationalUnit({}),
    OrganisationsRoot({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        isOurMinion,
        compare: compareOrganisations({}),
      }),
    ])
  ),
]);
