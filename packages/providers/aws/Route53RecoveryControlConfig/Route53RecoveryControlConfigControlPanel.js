const assert = require("assert");
const { pipe, tap, get, omit, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  Tagger,

  assignTags,
} = require("./Route53RecoveryControlConfigCommon");

const findId = () => pipe([get("ControlPanelArn")]);

const buildArn = () =>
  pipe([
    get("ControlPanelArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  pick(["ControlPanelArn"]),
  tap(({ ControlPanelArn }) => {
    assert(ControlPanelArn);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    assignTags({ endpoint, findId: findId() }),
    ({ Name, ...other }) => ({ ControlPanelName: Name, ...other }),
  ]);

const managedByOther = () => pipe([get("DefaultControlPanel")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html
exports.Route53RecoveryControlConfigControlPanel = ({}) => ({
  type: "ControlPanel",
  package: "route53-recovery-control-config",
  client: "Route53RecoveryControlConfig",
  region: "us-west-2",
  inferName: () => pipe([get("ControlPanelName")]),
  findName: () => pipe([get("ControlPanelName")]),
  findId,
  managedByOther,
  cannotBeDeleted: managedByOther,
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "Route53RecoveryControlConfig",
      parent: true,
      dependencyId: ({ lives, config }) => get("ClusterArn"),
    },
  },
  omitProperties: [
    "ClusterArn",
    "ControlPanelArn",
    "Status",
    "RoutingControlCount",
  ],
  propertiesDefault: { DefaultControlPanel: false },
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
              assignTags({ findId, endpoint }),
              ({ Name, ...other }) => ({ ControlPanelName: Name, ...other }),
            ]),
          config,
        }),
    ])(),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#describeControlPanel-property
  getById: {
    method: "describeControlPanel",
    pickId,
    getField: "ControlPanel",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#createControlPanel-property
  create: {
    method: "createControlPanel",
    pickCreated: ({ payload }) => pipe([get("ControlPanel"), pickId]),
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
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { cluster },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(cluster);
      }),
      () => otherProps,
      defaultsDeep({
        ClusterArn: getField(cluster, "ClusterArn"),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
