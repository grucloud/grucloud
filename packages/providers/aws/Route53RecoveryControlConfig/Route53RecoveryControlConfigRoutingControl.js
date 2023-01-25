const assert = require("assert");
const { pipe, tap, get, omit, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceRegion } = require("../AwsCommon");

const findId = () => pipe([get("RoutingControlArn")]);

const pickId = pipe([
  pick(["RoutingControlArn"]),
  tap(({ RoutingControlArn }) => {
    assert(RoutingControlArn);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([({ Name, ...other }) => ({ RoutingControlName: Name, ...other })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html
exports.Route53RecoveryControlConfigRoutingControl = ({}) => ({
  type: "RoutingControl",
  package: "route53-recovery-control-config",
  client: "Route53RecoveryControlConfig",
  region: "us-west-2",
  inferName: () => pipe([get("RoutingControlName")]),
  findName: () => pipe([get("RoutingControlName")]),
  findId,
  dependencies: {
    controlPanel: {
      type: "ControlPanel",
      group: "Route53RecoveryControlConfig",
      parent: true,
      dependencyId: ({ lives, config }) => get("ControlPanelArn"),
    },
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#listRoutingControls-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: {
            type: "ControlPanel",
            group: "Route53RecoveryControlConfig",
          },
          pickKey: pipe([
            tap(({ ControlPanelArn }) => {
              assert(ControlPanelArn);
            }),
            pick(["ControlPanelArn"]),
          ]),
          method: "listRoutingControls",
          getParam: "RoutingControls",
          decorate,
          config,
        }),
    ])(),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#describeRoutingControl-property
  getById: {
    method: "describeRoutingControl",
    pickId,
    getField: "RoutingControl",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#createRoutingControl-property
  create: {
    method: "createRoutingControl",
    pickCreated: ({ payload }) => pipe([get("RoutingControl"), pickId]),
    isInstanceUp: eq(get("Status"), "DEPLOYED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#updateRoutingControl-property
  update: {
    method: "updateRoutingControl",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#deleteRoutingControl-property
  destroy: { method: "deleteRoutingControl", pickId },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { controlPanel },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(controlPanel);
      }),
      () => otherProps,
      defaultsDeep({
        ClusterArn: getField(controlPanel, "ClusterArn"),
        ControlPanelArn: getField(controlPanel, "ControlPanelArn"),
      }),
    ])(),
});
