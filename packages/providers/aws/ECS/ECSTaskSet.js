const assert = require("assert");
const { pipe, tap, get, eq, assign, omit, map, pick } = require("rubico");
const {
  defaultsDeep,
  when,
  last,
  first,
  callProp,
  pluck,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, buildTagsEcs, dependencyTargetGroups } = require("./ECSCommon");

const buildArn = () =>
  pipe([
    get("taskSetArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ clusterArn, serviceArn, taskDefinitionArn, id, ...other }) => ({
      taskSet: id,
      cluster: clusterArn,
      service: serviceArn,
      taskDefinition: taskDefinitionArn,
      ...other,
    }),
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
  ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
  omitProperties: [
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
    "serviceRegistries[].registryArn",
    "stabilityStatus",
    "stabilityStatusAt",
    "failures",
  ],
  propertiesDefault: { platformVersion: "LATEST" },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      // serviceRegistries[].registryArn
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
    taskDefinition: {
      type: "TaskDefinition",
      group: "ECS",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("taskDefinition"),
          callProp("split", "/"),
          last,
          callProp("split", ":"),
          first,
          tap((name) => {
            assert(name);
          }),
          lives.getByName({
            type: "TaskDefinition",
            group: "ECS",
            providerName: config.config,
          }),
          get("id"),
        ]),
    },
    service: {
      type: "Service",
      group: "ECS",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("service"),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listTaskSets-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Service", group: "ECS" },
          pickKey: pipe([
            tap((params) => {
              assert(true);
            }),
            ({ clusterName, serviceName }) => ({
              cluster: clusterName,
              service: serviceName,
            }),
          ]),
          method: "describeTaskSets",
          getParam: "taskSets",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createTaskSet-property
  create: {
    method: "createTaskSet",
    shouldRetryOnExceptionMessages: [
      "does not have an associated load balancer",
    ],
    pickCreated: ({ name }) => pipe([get("taskSet")]),
    //isInstanceUp: eq(get("status"), "ACTIVE"),
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
    //isInstanceDown: eq(get("status"), "INACTIVE"),
  },
  getByName: getByNameCore,
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
        assert(service, "missing 'cluster' dependency");
        assert(taskDefinition, "missing 'taskDefinition' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        TaskSetName: name,
        cluster: getField(cluster, "clusterArn"),
        service: getField(service, "clusterArn"),
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
