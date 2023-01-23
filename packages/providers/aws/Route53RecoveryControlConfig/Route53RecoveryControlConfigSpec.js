const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const {
  Route53RecoveryControlConfigCluster,
} = require("./Route53RecoveryControlConfigCluster");

const {
  Route53RecoveryControlConfigControlPanel,
} = require("./Route53RecoveryControlConfigControlPanel");

const {
  Route53RecoveryControlConfigRoutingControl,
} = require("./Route53RecoveryControlConfigRoutingControl");

const {
  Route53RecoveryControlConfigSafetyRule,
} = require("./Route53RecoveryControlConfigSafetyRule");

const compare = compareAws({});

module.exports = pipe([
  () => [
    Route53RecoveryControlConfigCluster({}),
    Route53RecoveryControlConfigControlPanel({}),
    Route53RecoveryControlConfigRoutingControl({}),
    Route53RecoveryControlConfigSafetyRule({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: "Route53RecoveryControlConfig",
        compare: compare({}),
      }),
    ])
  ),
]);
