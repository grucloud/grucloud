const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "SecurityHub";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { SecurityHubAccount } = require("./SecurityHubAccount");
const { SecurityHubActionTarget } = require("./SecurityHubActionTarget");
const {
  SecurityHubFindingAggregator,
} = require("./SecurityHubFindingAggregator");

const { SecurityHubInsight } = require("./SecurityHubInsight");

const { SecurityHubMember } = require("./SecurityHubMember");

const {
  SecurityHubOrganizationAdminAccount,
} = require("./SecurityHubOrganizationAdminAccount");

const {
  SecurityHubOrganizationConfiguration,
} = require("./SecurityHubOrganizationConfiguration");

const {
  SecurityHubStandardsSubscription,
} = require("./SecurityHubStandardsSubscription");

module.exports = pipe([
  () => [
    SecurityHubAccount({}),
    SecurityHubActionTarget({}),
    SecurityHubFindingAggregator({}),
    SecurityHubInsight({}),
    SecurityHubMember({}),
    SecurityHubOrganizationAdminAccount({}),
    SecurityHubOrganizationConfiguration({}),
    SecurityHubStandardsSubscription({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
