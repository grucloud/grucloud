const assert = require("assert");
const {
  assign,
  filter,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  not,
  or,
  flatMap,
  omit,
} = require("rubico");
const { defaultsDeep, isEmpty, unless, first, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "ECSService",
});
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const findId = get("live.serviceArn");
const findName = get("live.serviceName");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSService = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Cluster",
      group: "ECS",
      ids: [live.clusterArn],
    },
    {
      type: "TaskDefinition",
      group: "ECS",
      ids: [live.taskDefinition],
    },
    {
      type: "LoadBalancer",
      group: "ELBv2",
      ids: [
        pipe([
          () =>
            lives.getByName({
              providerName: config.providerName,
              name: live.loadBalancerName,
              type: "LoadBalancer",
              group: "ELBv2",
            }),
          get("id"),
        ]),
      ],
    },
    {
      type: "TargetGroup",
      group: "ELBv2",
      ids: pluck("targetGroupArn")(live.loadBalancers),
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  const clusterNotFoundException = pipe([
    tap((params) => {
      assert(true);
    }),
    eq(get("code"), "ClusterNotFoundException"),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeServices-property
  const describeServices = pipe([
    tap(({ cluster, services }) => {
      assert(cluster);
      assert(Array.isArray(services));
    }),
    defaultsDeep({ include: ["TAGS"] }),
    ecs().describeServices,
    get("services"),
    tap((services) => {
      logger.debug(`describeServices ${tos(services)}`);
    }),
  ]);

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listServices-property
  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Cluster",
          group: "ECS",
        }),
      flatMap(
        pipe([
          get("id"),
          tap((cluster) => {
            assert(cluster);
          }),
          (cluster) =>
            pipe([
              () => ({ cluster }),
              ecs().listServices,
              get("serviceArns"),
              unless(
                isEmpty,
                pipe([(services) => ({ cluster, services }), describeServices])
              ),
            ])(),
        ])
      ),
      filter(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeServices-property

  const getById = ({ name, cluster }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(name);
          assert(cluster);
        }),
        () => ({ cluster, services: [name] }),
        describeServices,
        first,
        tap((params) => {
          assert(true);
        }),
      ]),
      switchCase([
        clusterNotFoundException,
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

  const isInstanceUp = eq(get("status"), "ACTIVE");
  const isUpById = pipe([getById, isInstanceUp]);

  const isInstanceDown = or([isEmpty, eq(get("status"), "INACTIVE")]);
  const isDownById = pipe([getById, isInstanceDown]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createService-property
  const create = ({
    payload,
    name,
    namespace,
    resolvedDependencies: { cluster },
  }) =>
    pipe([
      tap(() => {
        assert(cluster.live.clusterArn);
      }),
      () => payload,
      ecs().createService,
      tap(() =>
        retryCall({
          name: `createService isUpById: ${name}`,
          fn: () => isUpById({ name, cluster: cluster.live.clusterArn }),
        })
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateService-property
  const update = ({
    payload,
    name,
    namespace,
    resolvedDependencies: { cluster },
  }) =>
    pipe([
      tap(() => {
        assert(cluster.live.clusterArn);
      }),
      () => payload,
      assign({
        service: get("serviceName"),
        cluster: () => cluster.live.clusterArn,
      }),
      omit([
        "launchType",
        "schedulingStrategy",
        "enableECSManagedTags",
        "serviceName",
        "tags",
      ]),
      ecs().updateService,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteService-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      tap(({ serviceName, clusterArn }) => {
        assert(serviceName);
        assert(clusterArn);
      }),
      ({ serviceName, clusterArn }) => ({
        service: serviceName,
        cluster: clusterArn,
        force: true,
      }),
      tryCatch(
        pipe([
          ecs().deleteService,
          () =>
            retryCall({
              name: `deleteService isDownById: ${live.serviceName}`,
              fn: () =>
                isDownById({
                  name: live.serviceName,
                  cluster: live.clusterArn,
                }),
              config,
            }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(`error deleteService ${tos({ params, error })}`);
            }),
            () => error,
            switchCase([
              clusterNotFoundException,
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
    dependencies: { cluster, taskDefinition },
  }) =>
    pipe([
      tap(() => {
        assert(cluster, "missing 'cluster' dependency");
        assert(taskDefinition, "missing 'taskDefinition' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        serviceName: name,
        cluster: getField(cluster, "clusterArn"),
        taskDefinition: getField(taskDefinition, "taskDefinitionArn"),
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
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
