const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  eq,
  or,
  omit,
  pick,
  assign,
  any,
} = require("rubico");
const { defaultsDeep, isEmpty, size, when } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "ECSCluster" });
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  destroyAutoScalingGroupById,
  throwIfNotAwsError,
} = require("../AwsCommon");
const {
  AutoScalingAutoScalingGroup,
} = require("../Autoscaling/AutoScalingAutoScalingGroup");
const { AwsClient } = require("../AwsClient");
const {
  createECS,
  buildTagsEcs,
  tagResource,
  untagResource,
} = require("./ECSCommon");

const findName = () => get("clusterName");
const findId = () => get("clusterArn");
const pickId = pipe([({ clusterName }) => ({ clusters: [clusterName] })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSCluster = ({ spec, config }) => {
  const ecs = createECS(config);
  const client = AwsClient({ spec, config })(ecs);

  const managedByOther = () =>
    pipe([get("tags"), any(eq(get("key"), "AWSBatchServiceTag"))]);

  const autoScalingGroup = AutoScalingAutoScalingGroup({ spec, config });

  const findDependencies = ({ live, lives }) => [
    {
      type: "CapacityProvider",
      group: "ECS",
      ids: pipe([
        () => live,
        get("capacityProviders"),
        map(
          pipe([
            (name) =>
              lives.getByName({
                name,
                type: "CapacityProvider",
                group: "ECS",
                providerName: config.providerName,
              }),
            get("id"),
          ])
        ),
      ])(),
    },
    {
      type: "Key",
      group: "KMS",
      ids: [
        pipe([
          () => live,
          get("configuration.executeCommandConfiguration.kmsKeyId"),
        ])(),
      ],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeClusters-property
  const getById = client.getById({
    pickId,
    extraParams: {
      include: [
        "CONFIGURATIONS",
        "ATTACHMENTS",
        "STATISTICS",
        "SETTINGS",
        "TAGS",
      ],
    },
    method: "describeClusters",
    getField: "clusters",
    ignoreErrorCodes: ["ClusterNotFoundException"],
  });

  const getByName = pipe([({ name }) => ({ clusterName: name }), getById({})]);
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listClusters-property
  const getList = client.getList({
    method: "listClusters",
    getParam: "clusterArns",
    decorate: () =>
      pipe([
        tap((clusters) => {
          assert(clusters);
        }),
        (cluster) => ({ clusterName: cluster }),
        getById({}),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createCluster-property
  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { capacityProviders = [], kmsKey },
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
    ])();

  const create = client.create({
    method: "createCluster",
    filterPayload: omit(["Tags"]),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getById,
  });

  const destroyAutoScalingGroup = ({ live, lives }) =>
    pipe([
      () => live,
      get("capacityProviders"),
      map((name) =>
        pipe([
          () =>
            lives.getByName({
              name,
              type: "CapacityProvider",
              group: "ECS",
              providerName: config.providerName,
            }),
          get("autoScalingGroupProvider.autoScalingGroupArn"),
          destroyAutoScalingGroupById({ autoScalingGroup, lives, config }),
        ])()
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listContainerInstances-property
  const deregisterContainerInstance = ({ live }) =>
    tryCatch(
      pipe([
        () => ({ cluster: live.clusterName }),
        ecs().listContainerInstances,
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
            ecs().deregisterContainerInstance,
          ])
        ),
      ]),
      throwIfNotAwsError("ClusterNotFoundException")
    )();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateCluster-property
  //TODO update
  const update = client.update({
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
    config,
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteCluster-property
  const destroy = client.destroy({
    pickId: ({ clusterName }) => ({ cluster: clusterName }),
    preDestroy: pipe([
      tap(deregisterContainerInstance),
      tap(destroyAutoScalingGroup),
    ]),
    method: "deleteCluster",
    //TODO no or
    isInstanceDown: or([isEmpty, eq(get("status"), "INACTIVE")]),
    getById,
    ignoreErrorCodes: ["ClusterNotFoundException"],
    ignoreErrorMessages: [
      "The specified cluster is inactive. Specify an active cluster and try again.",
    ],
    config,
  });

  return {
    spec,
    findId,
    managedByOther,
    findDependencies,
    getById,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ ecs }),
    untagResource: untagResource({ ecs }),
  };
};
