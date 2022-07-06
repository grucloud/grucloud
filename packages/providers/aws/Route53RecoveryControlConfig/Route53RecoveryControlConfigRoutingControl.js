const assert = require("assert");
const { pipe, tap, get, omit, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
} = require("./Route53RecoveryControlConfigCommon");

const pickId = pipe([
  pick(["RoutingControlArn"]),
  tap(({ RoutingControlArn }) => {
    assert(RoutingControlArn);
  }),
]);

const model = ({ config }) => ({
  package: "route53-recovery-control-config",
  client: "Route53RecoveryControlConfig",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#describeRoutingControl-property
  getById: {
    method: "describeRoutingControl",
    pickId,
    getField: "RoutingControl",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#createRoutingControl-property
  create: {
    method: "createRoutingControl",
    pickCreated: ({ payload }) => pipe([pick(["RoutingControlArn"])]),
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html
exports.Route53RecoveryControlConfigRoutingControl = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.RoutingControlArn")]),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#listRoutingControls-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        tap((params) => {
          assert(client);
          assert(endpoint);
          assert(getById);
          assert(config);
        }),
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
            decorate: ({ endpoint, lives, parent }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
                //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#listAssociatedRoute53HealthChecks-property
              ]),
            config,
          }),
      ])(),
    getByName: getByNameCore,
    tagResource: tagResource({ property: "RoutingControlArn" }),
    untagResource: untagResource({ property: "RoutingControlArn" }),
    configDefault: ({
      name,
      namespace,
      properties: { Name, Tags, ...otherProps },
      dependencies: { controlPanel },
    }) =>
      pipe([
        tap((params) => {
          assert(controlPanel);
        }),
        () => otherProps,
        defaultsDeep({
          RoutingControlName: Name,
          ClusterArn: getField(controlPanel, "ClusterArn"),
          ControlPanelArn: getField(controlPanel, "ControlPanelArn"),
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
