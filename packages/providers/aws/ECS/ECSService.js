const assert = require("assert");
const { pipe, tap, get, eq, assign, omit, map } = require("rubico");
const { defaultsDeep, when, last, first, callProp } = require("rubico/x");

const { omitIfEmpty } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, buildTagsEcs, dependencyTargetGroups } = require("./ECSCommon");

const buildArn = () =>
  pipe([
    get("serviceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty([
      "placementConstraints",
      "placementStrategy",
      "loadBalancers",
      "serviceRegistries",
    ]),
    when(eq(get("propagateTags"), "NONE"), omit(["propagateTags"])),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSService = ({ compare }) => ({
  type: "Service",
  package: "ecs",
  client: "ECS",
  inferName: () => get("serviceName"),
  findName: () => get("serviceName"),
  findId: () => get("serviceArn"),
  ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
  omitProperties: [
    "taskDefinition",
    "clusterArn",
    "cluster",
    "createdAt",
    "events",
    "deployments",
    "runningCount",
    "pendingCount",
    "status",
    "serviceArn",
    "roleArn",
    "createdBy",
    "networkConfiguration.awsvpcConfiguration.securityGroups",
    "networkConfiguration.awsvpcConfiguration.subnets",
    "taskSets",
  ],
  propertiesDefault: {
    propagateTags: "NONE",
    deploymentController: { type: "ECS" },
  },
  compare: compare({
    filterAll: () =>
      pipe([
        assign({
          cluster: get("clusterArn"),
        }),
        assign({
          loadBalancers: pipe([
            get("loadBalancers"),
            map(omit(["targetGroupArn"])),
          ]),
        }),
        omitIfEmpty(["loadBalancers", "serviceRegistries"]),
      ]),
  }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
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
    alarms: {
      type: "MetricAlarm",
      group: "CloudWatch",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("deploymentConfiguration.alarms.alarmNames"),
          map(
            pipe([
              lives.getByName({
                type: "MetricAlarm",
                group: "CloudWatch",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
    cluster: {
      type: "Cluster",
      group: "ECS",
      parent: true,
      dependencyId: ({ lives, config }) => get("clusterArn"),
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
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("networkConfiguration.awsvpcConfiguration.subnets"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("networkConfiguration.awsvpcConfiguration.securityGroups"),
    },
    targetGroups: dependencyTargetGroups,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeServices-property
  getById: {
    pickId: pipe([
      ({ clusterArn, serviceName }) => ({
        cluster: clusterArn,
        services: [serviceName],
      }),
    ]),
    extraParams: { include: ["TAGS"] },
    method: "describeServices",
    getField: "services",
    ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listServices-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Cluster", group: "ECS" },
          pickKey: pipe([({ clusterName }) => ({ cluster: clusterName })]),
          method: "listServices",
          getParam: "serviceArns",
          config,
          decorate: ({ lives, parent: { clusterArn } }) =>
            pipe([
              pipe([
                (serviceArn) => ({ clusterArn, serviceName: serviceArn }),
                getById({}),
              ]),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createService-property
  create: {
    method: "createService",
    shouldRetryOnExceptionMessages: [
      "does not have an associated load balancer",
    ],
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateService-property
  update: {
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        assign({
          service: get("serviceName"),
          cluster: () => live.clusterArn,
        }),
        omit([
          "launchType",
          "schedulingStrategy",
          "enableECSManagedTags",
          "serviceName",
          "tags",
        ]),
      ])(),
    method: "updateService",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteService-property
  destroy: {
    pickId: ({ serviceName, clusterArn }) => ({
      service: serviceName,
      cluster: clusterArn,
    }),
    extraParam: { force: true },
    method: "deleteService",
    isInstanceDown: eq(get("status"), "INACTIVE"),
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
    dependencies: { cluster, taskDefinition, subnets, securityGroups },
    config,
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
