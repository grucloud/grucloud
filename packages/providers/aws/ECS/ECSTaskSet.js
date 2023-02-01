const assert = require("assert");
const { pipe, tap, get, eq, assign, flatMap, map, pick } = require("rubico");
const {
  defaultsDeep,
  when,
  last,
  find,
  callProp,
  pluck,
  filterOut,
  isEmpty,
} = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const {
  Tagger,
  buildTagsEcs,
  dependencyTargetGroups,
  dependencyTaskDefinition,
} = require("./ECSCommon");

const managedByOther = () => pipe([get("externalId"), isEmpty]);

const buildArn = () =>
  pipe([
    get("taskSetArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const renameKeys = pipe([
  assign({
    service: pipe([get("serviceArn"), callProp("split", "service/"), last]),
  }),
  ({ clusterArn, taskDefinitionArn, id, ...other }) => ({
    taskSet: id,
    cluster: clusterArn,
    taskDefinition: taskDefinitionArn,
    ...other,
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty(["loadBalancers"]),
    renameKeys,
  ]);

const findName = () => (live) =>
  pipe([
    () => live,
    get("externalId", live.taskSet),
    tap((name) => {
      assert(name);
    }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSTaskSet = ({ compare }) => ({
  type: "TaskSet",
  package: "ecs",
  client: "ECS",
  inferName: findName,
  findName,
  findId: () =>
    pipe([
      get("taskSet"),
      tap((id) => {
        assert(id);
      }),
    ]),
  findId: () => get("taskSet"),
  managedByOther,
  ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
  omitProperties: [
    "serviceArn",
    "taskSetArn",
    "taskSet",
    "taskDefinition",
    "cluster",
    "service",
    "createdAt",
    "status",
    "roleArn",
    "pendingCount",
    "runningCount",
    "createdAt",
    "updatedAt",
    "networkConfiguration.awsvpcConfiguration.securityGroups",
    "networkConfiguration.awsvpcConfiguration.subnets",
    "stabilityStatus",
    "stabilityStatusAt",
    "failures",
  ],
  propertiesDefault: { platformVersion: "LATEST" },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("serviceRegistries"),
        assign({
          serviceRegistries: pipe([
            get("serviceRegistries"),
            map(
              pipe([
                assign({
                  registryArn: pipe([
                    get("registryArn"),
                    replaceWithName({
                      groupType: "ServiceDiscovery::Service",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                }),
              ])
            ),
          ]),
        })
      ),
      when(
        get("loadBalancers"),
        assign({
          loadBalancers: pipe([
            get("loadBalancers"),
            map(
              pipe([
                assign({
                  targetGroupArn: pipe([
                    get("targetGroupArn"),
                    replaceWithName({
                      groupType: "ElasticLoadBalancingV2::TargetGroup",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                }),
              ])
            ),
          ]),
        })
      ),
    ]),
  dependencies: {
    capacityProviders: {
      type: "CapacityProvider",
      group: "ECS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("capacityProviderStrategy"), pluck("capacityProvider")]),
    },
    cluster: {
      type: "Cluster",
      group: "ECS",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("cluster"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    taskDefinition: dependencyTaskDefinition,
    service: {
      type: "Service",
      group: "ECS",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("service"),
          lives.getByName({
            type: "Service",
            group: "ECS",
            providerName: config.config,
          }),
          get("id"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    serviceDiscoveryService: {
      type: "Service",
      group: "ServiceDiscovery",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("serviceRegistries"),
          pluck("registryArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("networkConfiguration.awsvpcConfiguration.securityGroups"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("networkConfiguration.awsvpcConfiguration.subnets"),
    },
    targetGroups: dependencyTargetGroups,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskSets-property
  getById: {
    pickId: pipe([
      tap(({ taskSet }) => {
        assert(taskSet);
      }),
      ({ cluster, service, taskSet }) => ({
        cluster,
        service,
        taskSets: [taskSet],
        include: ["TAGS"],
      }),
    ]),
    method: "describeTaskSets",
    getField: "taskSets",
    ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskSets-property
  getList:
    ({ lives, client, endpoint, getById, config }) =>
    ({ lives }) =>
      pipe([
        lives.getByType({
          type: "Service",
          group: "ECS",
          providerName: config.providerName,
        }),
        flatMap(pipe([get("live.taskSets")])),
        filterOut(isEmpty),
        map(pipe([decorate({ endpoint }), getById({})])),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createTaskSet-property
  create: {
    method: "createTaskSet",
    shouldRetryOnExceptionMessages: [
      "does not have an associated load balancer",
    ],
    pickCreated: ({ endpoint, name }) =>
      pipe([get("taskSet"), decorate({ endpoint })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateTaskSet-property
  update: {
    filterParams: ({ payload, live }) => pipe([() => payload])(),
    method: "updateTaskSet",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteTaskSet-property
  destroy: {
    pickId: pipe([
      tap(({ cluster, service, taskSet }) => {
        assert(cluster);
        assert(service);
        assert(taskSet);
      }),
      pick(["cluster", "service", "taskSet"]),
      defaultsDeep({ force: true }),
    ]),
    method: "deleteTaskSet",
  },
  getByName:
    ({ endpoint }) =>
    ({ name, resolvedDependencies: { cluster, service } }) =>
      pipe([
        tap((params) => {
          assert(name);
          assert(cluster.live.clusterName);
          assert(service.live.serviceName);
        }),
        () => ({
          cluster: cluster.live.clusterName,
          services: [service.live.serviceName],
        }),
        endpoint().describeServices,
        get("services"),
        flatMap(get("taskSets")),
        find(eq(get("externalId"), name)),
        decorate({ endpoint }),
      ])(),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { cluster, taskDefinition, service, subnets, securityGroups },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(cluster, "missing 'cluster' dependency");
        assert(service, "missing 'service' dependency");
        assert(taskDefinition, "missing 'taskDefinition' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        cluster: getField(cluster, "clusterArn"),
        service: getField(service, "serviceArn"),
        taskDefinition: getField(taskDefinition, "taskDefinitionArn"),
        tags: buildTagsEcs({
          name,
          config,
          namespace,
          tags,
        }),
      }),
      when(
        () => subnets,
        defaultsDeep({
          networkConfiguration: {
            awsvpcConfiguration: {
              subnets: pipe([
                () => subnets,
                map((subnet) => getField(subnet, "SubnetId")),
              ])(),
            },
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          networkConfiguration: {
            awsvpcConfiguration: {
              securityGroups: pipe([
                () => securityGroups,
                map((securityGroup) => getField(securityGroup, "GroupId")),
              ])(),
            },
          },
        })
      ),
    ])(),
});
