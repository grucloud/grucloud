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
  not,
  omit,
  pick,
  assign,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  first,
  includes,
  unless,
  size,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "ECSCluster" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsAutoScalingGroup } = require("../autoscaling/AwsAutoScalingGroup");

const findName = get("live.clusterName");
const findId = get("live.clusterArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSCluster = ({ spec, config }) => {
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);
  const autoScalingGroup = AwsAutoScalingGroup({ config });

  const findDependencies = ({ live, lives }) => [
    {
      type: "CapacityProvider",
      group: "ecs",
      ids: pipe([
        () => live,
        get("capacityProviders"),
        map(
          pipe([
            (name) =>
              lives.getByName({
                name,
                type: "CapacityProvider",
                group: "ecs",
                providerName: config.providerName,
              }),
            get("id"),
          ])
        ),
      ])(),
    },
    {
      type: "Key",
      group: "kms",
      ids: pipe([
        () => live,
        get("configuration.executeCommandConfiguration.kmsKeyId"),
      ])(),
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeClusters-property
  const describeClusters = (params = {}) =>
    pipe([
      () => params,
      defaultsDeep({ include: ["TAGS"] }),
      ecs().describeClusters,
      get("clusters"),
      tap((clusters) => {
        logger.debug(`describeClusters #cluster ${tos(clusters)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#getParameter-property
  const getByName = ({ name }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(name);
        }),
        () => ({ clusters: [name] }),
        describeClusters,
        first,
      ]),
      switchCase([
        eq(get("code"), "ClusterNotFoundException"),
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listClusters-property

  const getList = () =>
    pipe([
      ecs().listClusters,
      get("clusterArns"),
      (clusters) => ({ clusters }),
      describeClusters,
    ])();
  const isUpByName = pipe([getByName, not(isEmpty)]);

  const isInstanceDown = or([isEmpty, eq(get("status"), "INACTIVE")]);

  const isDownByName = pipe([getByName, isInstanceDown]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createCluster-property
  const create = ({ payload, name, namespace }) =>
    pipe([
      () => payload,
      omit(["Tags"]),
      ecs().createCluster,
      tap(() =>
        retryCall({
          name: `createCluster isUpByName: ${name}`,
          fn: () => isUpByName({ name }),
        })
      ),
    ])();

  const destroyAutoScalingGroup = ({ live, lives }) =>
    pipe([
      () => live,
      get("capacityProviders"),
      map((name) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          () =>
            lives.getByName({
              name,
              type: "CapacityProvider",
              group: "ecs",
              providerName: config.providerName,
            }),
          tap((params) => {
            assert(true);
          }),
          get("autoScalingGroupProvider.autoScalingGroupArn"),
          (id) =>
            lives.getById({
              id,
              providerName: config.providerName,
              type: "AutoScalingGroup",
              group: "autoscaling",
            }),
          get("name"),
          unless(
            isEmpty,
            pipe([
              (AutoScalingGroupName) => ({ live: { AutoScalingGroupName } }),
              tap((params) => {
                assert(true);
              }),
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
        tap((params) => {
          assert(true);
        }),
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
  const destroy = ({ live, lives }) =>
    pipe([
      () => ({ live, lives }),
      tap(deregisterContainerInstance),
      tap(destroyAutoScalingGroup),
      () => ({ cluster: live.clusterName }),
      tap(({ cluster }) => {
        assert(cluster);
      }),
      tryCatch(
        pipe([
          ({ cluster }) =>
            retryCall({
              name: `deleteCluster isDownByName: ${live.clusterName}`,
              fn: () => ecs().deleteCluster({ cluster }),
              config,
              shouldRetryOnException: ({ error }) =>
                pipe([
                  tap(() => {
                    logger.error(
                      `deleteCluster isExpectedException ${tos(error)}`
                    );
                  }),
                  () => error,
                  eq(get("code"), "ClusterContainsContainerInstancesException"),
                ])(),
            }),
          () =>
            retryCall({
              name: `deleteCluster isDownByName: ${live.clusterName}`,
              fn: () => isDownByName({ name: live.clusterName }),
              config,
            }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(`error deleteCluster ${tos({ params, error })}`);
            }),
            () => error,
            switchCase([
              or([
                eq(get("code"), "ClusterNotFoundException"),
                pipe([
                  get("message"),
                  includes(
                    "The specified cluster is inactive. Specify an active cluster and try again."
                  ),
                ]),
              ]),
              () => undefined,
              () => {
                throw error;
              },
            ]),
          ])()
      ),
    ])();

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
      tap((params) => {
        assert(true);
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
