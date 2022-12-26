const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  eq,
  omit,
  pick,
  assign,
  any,
} = require("rubico");
const { defaultsDeep, size, when } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "ECSCluster" });
const { getField } = require("@grucloud/core/ProviderCommon");

const { throwIfNotAwsError } = require("../AwsCommon");
const {
  Tagger,
  buildTagsEcs,
  destroyAutoScalingGroupById,
} = require("./ECSCommon");

const buildArn = () =>
  pipe([
    get("clusterArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findName = () => get("clusterName");
const findId = () => get("clusterArn");
const pickId = pipe([({ clusterName }) => ({ clusters: [clusterName] })]);

const managedByOther = () =>
  pipe([get("tags"), any(eq(get("key"), "AWSBatchServiceTag"))]);

const destroyAutoScalingGroup = ({ endpoint, lives, config }) =>
  pipe([
    tap((params) => {
      assert(lives);
    }),
    get("capacityProviders"),
    map(
      pipe([
        lives.getByName({
          type: "CapacityProvider",
          group: "ECS",
          providerName: config.providerName,
        }),
        get("autoScalingGroupProvider.autoScalingGroupArn"),
        destroyAutoScalingGroupById({ lives, config }),
      ])
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listContainerInstances-property
const deregisterContainerInstance =
  ({ endpoint }) =>
  (live) =>
    tryCatch(
      pipe([
        () => ({ cluster: live.clusterName }),
        endpoint().listContainerInstances,
        get("containerInstanceArns"),
        tap((containerInstanceArns) => {
          logger.debug(
            `deregisterContainerInstance #size ${size(containerInstanceArns)}`
          );
        }),
        map(
          pipe([
            (containerInstance) => ({
              cluster: live.clusterName,
              containerInstance,
              force: true,
            }),
            endpoint().deregisterContainerInstance,
          ])
        ),
      ]),
      throwIfNotAwsError("ClusterNotFoundException")
    )();

exports.ECSCluster = ({ compare }) => ({
  type: "Cluster",
  package: "ecs",
  client: "ECS",
  inferName: findName,
  findName,
  findId,
  ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
  managedByOther,
  propertiesDefault: { defaultCapacityProviderStrategy: [] },
  compare: compare({}),
  omitProperties: [
    "clusterArn",
    "status",
    "registeredContainerInstancesCount",
    "runningTasksCount",
    "pendingTasksCount",
    "activeServicesCount",
    "statistics",
    "attachments",
    "attachmentsStatus",
    "configuration.executeCommandConfiguration.kmsKeyId",
  ],
  filterLive: () =>
    pipe([
      pick(["clusterName", "settings", "defaultCapacityProviderStrategy"]),
    ]),
  dependencies: {
    capacityProviders: {
      type: "CapacityProvider",
      group: "ECS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("capacityProviders"),
          map(
            pipe([
              lives.getByName({
                type: "CapacityProvider",
                group: "ECS",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) =>
        get("configuration.executeCommandConfiguration.kmsKeyId"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        get(
          "configuration.executeCommandConfiguration.logConfiguration.s3BucketName"
        ),
    },
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        get(
          "configuration.executeCommandConfiguration.logConfiguration.cloudWatchLogGroupName"
        ),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeClusters-property
  getById: {
    pickId: pipe([
      pickId,
      defaultsDeep({
        include: [
          "CONFIGURATIONS",
          "ATTACHMENTS",
          "STATISTICS",
          "SETTINGS",
          "TAGS",
        ],
      }),
    ]),
    method: "describeClusters",
    getField: "clusters",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listClusters-property
  getList: {
    method: "listClusters",
    getParam: "clusterArns",
    decorate: ({ getById }) =>
      pipe([
        tap((cluster) => {
          assert(cluster);
        }),
        (cluster) => ({ clusterName: cluster }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createCluster-property
  create: {
    method: "createCluster",
    filterPayload: omit(["Tags"]),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateCluster-property
  update: {
    filterParams: ({ payload }) =>
      pipe([
        tap((param) => {
          assert(payload.clusterName);
        }),
        () => payload,
        assign({ cluster: get("clusterName") }),
        pick(["cluster", "settings", "configuration"]),
      ])(),
    method: "updateCluster",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteCluster-property
  destroy: {
    pickId: ({ clusterName }) => ({ cluster: clusterName }),
    preDestroy: ({ endpoint, lives, config }) =>
      pipe([
        tap(deregisterContainerInstance({ endpoint, lives, config })),
        tap(destroyAutoScalingGroup({ endpoint, lives, config })),
      ]),
    method: "deleteCluster",
    isInstanceDown: eq(get("status"), "INACTIVE"),
    ignoreErrorCodes: ["ClusterNotFoundException"],
    ignoreErrorMessages: [
      "The specified cluster is inactive. Specify an active cluster and try again.",
    ],
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ clusterName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { capacityProviders = [], kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        capacityProviders: pipe([
          () => capacityProviders,
          map((capacityProvider) => getField(capacityProvider, "name")),
        ])(),
        tags: buildTagsEcs({
          name,
          config,
          namespace,
          tags,
        }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          configuration: {
            executeCommandConfiguration: { kmsKeyId: getField(kmsKey, "Arn") },
          },
        })
      ),
    ])(),
});
