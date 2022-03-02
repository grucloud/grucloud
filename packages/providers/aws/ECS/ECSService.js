const assert = require("assert");
const { assign, pipe, tap, get, eq, or, omit } = require("rubico");
const { defaultsDeep, isEmpty, unless, pluck } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { buildTagsEcs, findDependenciesCluster } = require("./ECSCommon");

const findId = get("live.serviceArn");
const findName = get("live.serviceName");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSService = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  // findDependencies for ECSService
  const findDependencies = ({ live, lives }) => [
    findDependenciesCluster({ live }),
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

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listServices-property
  const getList = client.getListWithParent({
    parent: { type: "Cluster", group: "ECS" },
    pickKey: pipe([({ clusterName }) => ({ cluster: clusterName })]),
    method: "listServices",
    getParam: "serviceArns",
    config,
    decorate: ({ lives, parent: { clusterArn } }) =>
      pipe([
        tap((params) => {
          assert(clusterArn);
        }),
        pipe([
          (serviceArn) => ({ clusterArn, serviceName: serviceArn }),
          getById,
        ]),
      ]),
  });

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
        tags: buildTagsEcs({
          name,
          config,
          namespace,
          Tags,
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
  };
};
