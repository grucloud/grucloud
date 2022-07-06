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
  pick(["ControlPanelArn"]),
  tap(({ ControlPanelArn }) => {
    assert(ControlPanelArn);
  }),
]);

const managedByOther = pipe([get("live.DefaultControlPanel")]);

const model = ({ config }) => ({
  package: "route53-recovery-control-config",
  client: "Route53RecoveryControlConfig",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#describeControlPanel-property
  getById: {
    method: "describeControlPanel",
    pickId,
    getField: "ControlPanel",
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#createControlPanel-property
  create: {
    method: "createControlPanel",
    pickCreated: ({ payload }) => pipe([pick(["ControlPanelArn"])]),
    isInstanceUp: eq(get("Status"), "DEPLOYED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#updateControlPanel-property
  update: {
    method: "updateControlPanel",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#deleteControlPanel-property
  destroy: { method: "deleteControlPanel", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html
exports.Route53RecoveryControlConfigControlPanel = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.ControlPanelArn")]),
    managedByOther,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#listControlPanels-property
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
            parent: { type: "Cluster", group: "Route53RecoveryControlConfig" },
            pickKey: pipe([
              tap(({ ClusterArn }) => {
                assert(ClusterArn);
              }),
              pick(["ClusterArn"]),
            ]),
            method: "listControlPanels",
            getParam: "ControlPanels",
            decorate: ({ lives, parent }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
              ]),
            config,
          }),
      ])(),
    getByName: getByNameCore,
    tagResource: tagResource({ property: "ControlPanelArn" }),
    untagResource: untagResource({ property: "ControlPanelArn" }),
    configDefault: ({
      name,
      namespace,
      properties: { Name, Tags, ...otherProps },
      dependencies: { cluster },
    }) =>
      pipe([
        tap((params) => {
          assert(cluster);
        }),
        () => otherProps,
        defaultsDeep({
          ControlPanelName: Name,
          ClusterArn: getField(cluster, "ClusterArn"),
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
