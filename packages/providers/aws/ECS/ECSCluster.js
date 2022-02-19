const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  or,
  omit,
  pick,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty, unless, size } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "ECSCluster" });
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  AutoScalingAutoScalingGroup,
} = require("../Autoscaling/AutoScalingAutoScalingGroup");
const { AwsClient } = require("../AwsClient");

const findName = get("live.clusterName");
const findId = get("live.clusterArn");
const pickId = pipe([
  tap(({ clusterName }) => {
    assert(clusterName);
  }),
  ({ clusterName }) => ({ clusters: [clusterName] }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSCluster = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);
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

  const findNamespace = pipe([() => ""]);

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

  const getByName = pipe([({ name }) => ({ clusterName: name }), getById]);
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
        getById,
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createCluster-property
  const create = client.create({
    method: "createCluster",
    filterPayload: omit(["Tags"]),
    pickCreated:
      ({ payload }) =>
      (result) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => payload,
        ])(),
    pickId,
    getById,
    config,
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
          (id) =>
            lives.getById({
              id,
              providerName: config.providerName,
              type: "AutoScalingGroup",
              group: "AutoScaling",
            }),
          get("name"),
          unless(
            isEmpty,
            pipe([
              (AutoScalingGroupName) => ({ live: { AutoScalingGroupName } }),
              autoScalingGroup.destroy,
            ])
          ),
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
      switchCase([
        eq(get("code"), "ClusterNotFoundException"),
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateCluster-property
  const update = ({ payload, name, namespace }) =>
    pipe([
      () => payload,
      assign({ cluster: get("clusterName") }),
      pick(["cluster", "settings", "configuration"]),
      ecs().updateCluster,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteCluster-property
  const destroy = client.destroy({
    pickId: ({ clusterName }) => ({ cluster: clusterName }),
    preDestroy: pipe([
      tap(deregisterContainerInstance),
      tap(destroyAutoScalingGroup),
    ]),
    method: "deleteCluster",
    isInstanceDown: or([isEmpty, eq(get("status"), "INACTIVE")]),
    getById,
    ignoreErrorCodes: ["ClusterNotFoundException"],
    ignoreErrorMessages: [
      "The specified cluster is inactive. Specify an active cluster and try again.",
    ],
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { capacityProviders = [] },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        clusterName: name,
        capacityProviders: pipe([
          () => capacityProviders,
          map((capacityProvider) => getField(capacityProvider, "name")),
        ])(),
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
          key: "key",
          value: "value",
        }),
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
