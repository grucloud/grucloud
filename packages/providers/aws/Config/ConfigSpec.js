const assert = require("assert");
const { tap, pipe, map, get, switchCase, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Config";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { ConfigConfigRule } = require("./ConfigConfigRule");
const {
  ConfigConfigurationRecorder,
} = require("./ConfigConfigurationRecorder");
const {
  ConfigConfigurationRecorderStatus,
} = require("./ConfigConfigurationRecorderStatus");
const { ConfigConformancePack } = require("./ConfigConformancePack");
const { ConfigDeliveryChannel } = require("./ConfigDeliveryChannel");

module.exports = pipe([
  () => [
    ConfigConfigRule({}),
    ConfigConfigurationRecorder({}),
    ConfigConfigurationRecorderStatus({}),
    ConfigConformancePack({}),
    ConfigDeliveryChannel({}),
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
