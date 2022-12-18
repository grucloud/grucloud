const assert = require("assert");
const { pipe, tap, get, pick, map, eq, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags, replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger, decorateCluster } = require("./CloudHSMV2Common");

const buildArn = () =>
  pipe([
    get("ClusterId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ClusterId }) => {
    assert(ClusterId);
  }),
  pick(["ClusterId"]),
]);

const tagsToPayload = ({ Tags, ...other }) => ({
  ...other,
  TagList: Tags,
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html
exports.CloudHSMV2Cluster = () => ({
  type: "Cluster",
  package: "cloudhsm-v2",
  client: "CloudHSMV2",
  propertiesDefault: { BackupPolicy: "DEFAULT", HsmType: "hsm1.medium" },
  omitProperties: [
    "ClusterId",
    "CreateTimestamp",
    "SecurityGroup",
    "State",
    "VpcId",
    "SubnetIds",
    "Certificates",
    "ClusterName",
    "Hsms",
  ],
  inferName: ({ dependenciesSpec: { vpc } }) => pipe([() => `cluster::${vpc}`]),
  findName: () =>
    pipe([
      get("ClusterName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ClusterId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      parent: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
  },
  ignoreErrorCodes: ["CloudHsmResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html#getCluster-property
  getById: {
    method: "describeClusters",
    getField: "Clusters",
    pickId: pipe([
      ({ ClusterId }) => ({
        Filters: { clusterIds: [ClusterId] },
      }),
    ]),
    decorate: decorateCluster,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html#listClusters-property
  getList: {
    method: "describeClusters",
    getParam: "Clusters",
    decorate: decorateCluster,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html#createCluster-property
  create: {
    filterPayload: pipe([tagsToPayload]),
    method: "createCluster",
    pickCreated: ({ payload }) => pipe([get("Cluster")]),
    isInstanceUp: pipe([eq(get("State"), "UNINITIALIZED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html#updateCluster-property
  update: {
    method: "updateCluster",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
    isInstanceDown: pipe([eq(get("State"), "DELETED")]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => subnets,
        defaultsDeep({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
    ])(),
});
