const { replaceWithName } = require("@grucloud/core/Common");
const assert = require("assert");
const { tap, pipe, map, get, assign, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws, replaceRegion } = require("../AwsCommon");
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

const filterLiveRule = ({ lives, providerConfig }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      AssertedControls: pipe([
        get("AssertedControls"),
        map(
          replaceWithName({
            groupType: "Route53RecoveryControlConfig::RoutingControl",
            providerConfig,
            lives,
            path: "id",
          })
        ),
      ]),
      ControlPanelArn: pipe([
        get("ControlPanelArn"),
        replaceWithName({
          groupType: "Route53RecoveryControlConfig::ControlPanel",
          providerConfig,
          lives,
          path: "id",
        }),
      ]),
    }),
  ]);

module.exports = pipe([
  () => [
    {
      type: "Cluster",
      Client: Route53RecoveryControlConfigCluster,
      inferName: pipe([get("properties.ClusterName")]),
      omitProperties: ["ClusterArn", "Status", "ClusterEndpoints"],
    },
    {
      type: "ControlPanel",
      Client: Route53RecoveryControlConfigControlPanel,
      inferName: pipe([get("properties.ControlPanelName")]),
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
      inferName: pipe([get("properties.RoutingControlName")]),
      dependencies: {
        controlPanel: { type: "ControlPanel", group: GROUP, parent: true },
      },
      omitProperties: [
        "RoutingControlArn",
        "ControlPanelArn",
        "ClusterArn",
        "Status",
      ],
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            RoutingControlName: pipe([
              get("RoutingControlName"),
              replaceRegion({ providerConfig }),
            ]),
          }),
        ]),
    },
    {
      type: "SafetyRule",
      Client: Route53RecoveryControlConfigSafetyRule,
      inferName: pipe([
        get("properties"),
        switchCase([
          get("AssertionRule.Name"),
          get("AssertionRule.Name"),
          get("GatingRule.Name"),
          get("GatingRule.Name"),
          (properties) => {
            assert(false, `no AssertionRule or GatingRule`);
          },
        ]),
      ]),
      dependencies: {
        controlPanel: { type: "ControlPanel", group: GROUP, parent: true },
        routingControls: { type: "RoutingControl", group: GROUP, list: true },
      },
      omitProperties: [
        "AssertionRule.SafetyRuleArn",
        "AssertionRule.Status",
        "GatingRule.SafetyRuleArn",
        "GatingRule.Status",
      ],
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          switchCase([
            get("AssertionRule"),
            assign({
              AssertionRule: pipe([
                get("AssertionRule"),
                filterLiveRule({ lives, providerConfig }),
              ]),
            }),
            get("GatingRule"),
            assign({
              GatingRule: pipe([
                get("GatingRule"),
                filterLiveRule({ lives, providerConfig }),
              ]),
            }),
            (live) => {
              assert(false, "AssertionRule or GatingRule");
            },
          ]),
        ]),
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
