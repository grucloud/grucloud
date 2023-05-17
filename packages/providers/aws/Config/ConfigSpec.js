const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Config";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });
//
const {
  ConfigAggregationAuthorization,
} = require("./ConfigAggregationAuthorization");

const { ConfigConfigRule } = require("./ConfigConfigRule");
const {
  ConfigConfigurationAggregator,
} = require("./ConfigConfigurationAggregator");
const {
  ConfigConfigurationRecorder,
} = require("./ConfigConfigurationRecorder");
const {
  ConfigConfigurationRecorderStatus,
} = require("./ConfigConfigurationRecorderStatus");
const { ConfigConformancePack } = require("./ConfigConformancePack");
const { ConfigDeliveryChannel } = require("./ConfigDeliveryChannel");
const {
  ConfigOrganizationConfigRule,
} = require("./ConfigOrganizationConfigRule");
const {
  ConfigOrganizationConformancePack,
} = require("./ConfigOrganizationConformancePack");
const {
  ConfigRemediationConfiguration,
} = require("./ConfigRemediationConfiguration");

module.exports = pipe([
  () => [
    ConfigAggregationAuthorization({}),
    ConfigConfigRule({}),
    ConfigConfigurationAggregator({}),
    ConfigConfigurationRecorder({}),
    ConfigConfigurationRecorderStatus({}),
    ConfigConformancePack({}),
    ConfigDeliveryChannel({}),
    ConfigOrganizationConfigRule({}),
    ConfigOrganizationConformancePack({}),
    ConfigRemediationConfiguration({}),
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
