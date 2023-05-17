const assert = require("assert");
const { pipe, tap, get, map, assign } = require("rubico");
const { defaultsDeep, when, pluck, isIn } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./MemoryDBCommon");

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  ({ Name }) => ({ ClusterName: Name }),
]);

const buildArn = () =>
  pipe([
    get("ARN"),
    tap((ARN) => {
      assert(ARN);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      SecurityGroupIds: pipe([get("SecurityGroups"), pluck("SecurityGroupId")]),
    }),
    ({ NumberOfShards, ...other }) => ({ NumShards: NumberOfShards, ...other }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    tap((params) => {
      assert(true);
    }),
  ]);

const filterPayload = pipe([
  ({ Name, ...other }) => ({
    ClusterName: Name,
    ...other,
  }),
]);

exports.MemoryDBCluster = ({}) => ({
  type: "Cluster",
  package: "memorydb",
  client: "MemoryDB",
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findId: () => pipe([get("ARN")]),
  ignoreErrorCodes: ["ClusterNotFoundFault"],
  propertiesDefault: {
    TLSEnabled: true,
    AutoMinorVersionUpgrade: true,
    SnapshotRetentionLimit: 1,
    DataTiering: "false",
  },
  omitProperties: [
    "ARN",
    "SecurityGroups",
    "EnginePatchVersion",
    "KmsKeyId",
    "Status",
    "PendingUpdates",
    "ClusterEndpoint",
    "ParameterGroupStatus",
    "SnsTopicStatus",
    "SubnetGroupName",
    "NumberOfShards",
    "SecurityGroups",
  ],
  dependencies: {
    acl: {
      type: "ACL",
      group: "MemoryDB",
      dependencyId: ({ lives, config }) => get("ACLName"),
      excludeDefaultDependencies: true,
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    parameterGroup: {
      type: "ParameterGroup",
      group: "MemoryDB",
      dependencyId: ({ lives, config }) => pipe([get("ParameterGroupName")]),
      excludeDefaultDependencies: true,
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      pathId: "SecurityGroupIds",
      dependencyIds: ({ lives, config }) => pipe([get("SecurityGroupIds")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      pathId: "SnsTopicArn",
      dependencyId: ({ lives, config }) => get("SnsTopicArn"),
    },
    subnetGroup: {
      type: "SubnetGroup",
      group: "MemoryDB",
      dependencyId: ({ lives, config }) => get("SubnetGroupName"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeClusters-property
  getById: {
    method: "describeClusters",
    getField: "Clusters",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeClusters-property
  getList: {
    method: "describeClusters",
    getParam: "Clusters",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#createCluster-property
  create: {
    method: "createCluster",
    filterPayload,
    pickCreated: ({ payload }) => pipe([get("Cluster")]),
    isInstanceUp: pipe([get("Status"), isIn(["available"])]),
    configIsUp: { retryCount: 60 * 10, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#updateCluster-property
  update: {
    method: "updateCluster",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
    shouldRetryOnExceptionCodes: ["InvalidClusterStateFault"],
    configIsDown: { retryCount: 45 * 10, retryDelay: 5e3 },
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({
        Name: name,
      }),
      getById({}),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey, subnetGroup, securityGroups },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
      when(
        () => subnetGroup,
        assign({
          SubnetGroupName: () => subnetGroup.config.Name,
        })
      ),
      when(() => kmsKey, defaultsDeep({ KmsKeyId: getField(kmsKey, "Arn") })),
      when(
        () => securityGroups,
        assign({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ]),
        })
      ),
      tap((params) => {
        assert(true);
      }),
    ])(),
});
