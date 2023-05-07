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

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    ({ NumberOfShards, ...other }) => ({ NumShards: NumberOfShards, ...other }),
    tap((params) => {
      assert(true);
    }),
    assignTags({ endpoint }),
  ]);

const buildArn = () => pipe([get("ARN")]);

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
    "SnsTopicArn",
    "SubnetGroupName",
    "SecurityGroupIds",
    "NumberOfShards",
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
      dependencyIds: ({ lives, config }) =>
        pipe([get("SecurityGroups"), pluck("SecurityGroupId")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
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
    filterPayload: pipe([
      ({ Name, ...other }) => ({
        ClusterName: Name,
        ...other,
      }),
    ]),
    pickCreated: ({ payload }) => pipe([get("Cluster")]),
    isInstanceUp: pipe([get("Status"), isIn(["available"])]),
    configIsUp: { retryCount: 60 * 10, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
    shouldRetryOnExceptionCodes: ["InvalidClusterStateFault"],
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#modifyCluster-property
  update:
    ({ endpoint }) =>
    async ({ pickId, payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
        () => diff,
      ])(),
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
