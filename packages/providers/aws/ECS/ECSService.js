const assert = require("assert");
const {
  assign,
  filter,
  pipe,
  tap,
  get,
  eq,
  not,
  or,
  flatMap,
  omit,
} = require("rubico");
const { defaultsDeep, isEmpty, unless, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "ECSService",
});
const { tos } = require("@grucloud/core/tos");
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

  const findNamespace = pipe([() => ""]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeServices-property
  const getById = client.getById({
    pickId: pipe([
      tap(({ clusterArn, serviceName }) => {
        assert(clusterArn);
        assert(serviceName);
      }),
      ({ clusterArn, serviceName }) => ({
        cluster: clusterArn,
        services: [serviceName],
      }),
    ]),
    extraParams: { include: ["TAGS"] },
    method: "describeServices",
    getField: "services",
    ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
  });

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
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createService-property
  const create = client.create({
    method: "createService",
    pickCreated:
      ({ name }) =>
      ({ service }) =>
        pipe([
          tap(() => {
            assert(name);
            assert(service);
          }),
          () => ({ serviceName: name, clusterArn: service.clusterArn }),
        ])(),
    isInstanceUp: eq(get("status"), "ACTIVE"),
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateService-property
  // TODO update

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
  const destroy = client.destroy({
    pickId: ({ serviceName, clusterArn }) => ({
      service: serviceName,
      cluster: clusterArn,
    }),
    extraParam: { force: true },
    method: "deleteService",
    isInstanceDown: or([isEmpty, eq(get("status"), "INACTIVE")]),
    getById,
    ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
    config,
  });

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
