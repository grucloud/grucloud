const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
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

const GROUP = "Route53RecoveryControlConfig";

const compareRoute53RecoveryControlConfig = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Cluster",
      Client: Route53RecoveryControlConfigCluster,
      inferName: pipe([get("properties.Name")]),
      omitProperties: ["ClusterArn", "Status", "ClusterEndpoints"],
    },
    {
      type: "ControlPanel",
      Client: Route53RecoveryControlConfigControlPanel,
      inferName: pipe([get("properties.Name")]),
      dependencies: {
        cluster: { type: "Cluster", group: GROUP, parent: true },
      },
      omitProperties: [
        "ClusterArn",
        "ControlPanelArn",
        "Status",
        "RoutingControlCount",
      ],
      propertiesDefault: { DefaultControlPanel: false },
    },
    {
      type: "RoutingControl",
      Client: Route53RecoveryControlConfigRoutingControl,
      inferName: pipe([get("properties.Name")]),
      dependencies: {
        controlPanel: { type: "ControlPanel", group: GROUP, parent: true },
      },
      omitProperties: ["RoutingControlArn", "ControlPanelArn", "Status"],
    },
    {
      type: "SafetyRule",
      Client: Route53RecoveryControlConfigSafetyRule,
      //TODO
      inferName: pipe([get("properties.ASSERTION.Name")]),
      dependencies: {
        controlPanel: { type: "ControlPanel", group: GROUP, parent: true },
      },
      omitProperties: [
        "ASSERTION.SafetyRuleArn",
        "ASSERTION.ControlPanelArn",
        "ASSERTION.Status",
        "GATING.SafetyRuleArn",
        "GATING.ControlPanelArn",
        "GATING.Status",
      ],
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareRoute53RecoveryControlConfig({}),
    })
  ),
]);
