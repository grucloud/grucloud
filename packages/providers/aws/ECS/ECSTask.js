const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { findNameInTagsOrId } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, buildTagsEcs } = require("./ECSCommon");

const buildArn = () =>
  pipe([
    get("taskArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const managedByOther = () =>
  pipe([get("group"), callProp("startsWith", "service:")]);

const pickId = pipe([
  tap(({ taskArn, clusterArn }) => {
    assert(taskArn);
    assert(clusterArn);
  }),
  ({ taskArn, clusterArn }) => ({
    task: taskArn,
    cluster: clusterArn,
  }),
]);

const findId = () =>
  pipe([
    get("taskArn"),
    tap((id) => {
      assert(id);
    }),
  ]);

const findName = findNameInTagsOrId({ findId });

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSTask = () => ({
  type: "Task",
  package: "ecs",
  client: "ECS",
  propertiesDefault: {},
  omitProperties: ["taskDefinitionArn", "clusterArn"],
  // inferName: () =>
  //   pipe([
  //     get("Name"),
  //     tap((Name) => {
  //       assert(Name);
  //     }),
  //   ]),
  findName,
  findId: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("taskArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
  filterLive: () => pick(["enableExecuteCommand", "launchType", "overrides"]),
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "ECS",
      parent: true,
      dependencyId: ({ lives, config }) => get("clusterArn"),
    },
    taskDefinition: {
      type: "TaskDefinition",
      group: "ECS",
      dependencyId: ({ lives, config }) => get("taskDefinitionArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#getTask-property
  getById: {
    pickId: pipe([pickId, defaultsDeep({ include: ["TAGS"] })]),
    method: "describeTasks",
    getField: "tasks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listTasks-property
  getList: {
    method: "listTasks",
    getParam: "Tasks",
    decorate: ({ getById }) => pipe([getById]),
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Cluster", group: "ECS" },
          pickKey: pipe([({ clusterName }) => ({ cluster: clusterName })]),
          method: "listTasks",
          getParam: "taskArns",
          config,
          decorate: ({ lives, parent: { clusterArn } }) =>
            pipe([(taskArn) => ({ taskArn, clusterArn }), getById({})]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createTask-property
  create: {
    method: "runTask",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateTask-property
  update: {
    method: "updateTask",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteTask-property
  destroy: {
    method: "stopTask",
    pickId,
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
    dependencies: { cluster, taskDefinition, subnets, securityGroups = [] },
  }) =>
    pipe([
      tap(() => {
        assert(cluster, "missing 'cluster' dependency");
        assert(taskDefinition, "missing 'taskDefinition' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        referenceId: name,
        cluster: getField(cluster, "clusterArn"),
        taskDefinition: `${getField(taskDefinition, "family")}:${getField(
          taskDefinition,
          "revision"
        )}`,
        tags: buildTagsEcs({
          name,
          config,
          namespace,
          tags,
        }),
      }),
    ])(),
});
