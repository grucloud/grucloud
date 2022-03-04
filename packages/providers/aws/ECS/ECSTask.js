const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, callProp, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const { findNameInTagsOrId } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  createECS,
  buildTagsEcs,
  findDependenciesCluster,
} = require("./ECSCommon");

const findId = get("live.taskArn");
const findName = findNameInTagsOrId({ findId });

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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSTask = ({ spec, config }) => {
  const ecs = createECS(config);
  const client = AwsClient({ spec, config })(ecs);

  // findDependencies for ECSTask
  const findDependencies = ({ live, lives }) => [
    findDependenciesCluster({ live }),
    {
      type: "TaskDefinition",
      group: "ECS",
      ids: [live.taskDefinitionArn],
    },
    {
      type: "ContainerInstance",
      group: "ECS",
      ids: [live.containerInstanceArn],
    },
    {
      type: "Service",
      group: "ECS",
      ids: [
        pipe([
          () => live,
          get("group"),
          when(
            callProp("startsWith", "service:"),
            pipe([
              tap((params) => {
                assert(true);
              }),
              callProp("replace", "service:", ""),
              (name) =>
                lives.getByName({
                  name,
                  type: "Service",
                  group: "ECS",
                  providerName: config.providerName,
                }),
              get("id"),
            ])
          ),
        ])(),
      ],
    },
  ];

  const findNamespace = pipe([() => ""]);

  const managedByOther = ({ live }) =>
    pipe([() => live, get("group"), callProp("startsWith", "service:")])();

  const ignoreErrorCodes = [
    "ClusterNotFoundException",
    "InvalidParameterException",
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTasks-property
  const getById = client.getById({
    pickId,
    method: "describeTasks",
    getField: "tasks",
    extraParams: { include: ["TAGS"] },
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listTasks-property
  const getList = client.getListWithParent({
    parent: { type: "Cluster", group: "ECS" },
    pickKey: pipe([({ clusterName }) => ({ cluster: clusterName })]),
    method: "listTasks",
    getParam: "taskArns",
    config,
    decorate: ({ lives, parent: { clusterArn } }) =>
      pipe([(taskArn) => ({ taskArn, clusterArn }), getById]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#runTask-property
  //TODO create
  const create = ({ payload, name, namespace }) =>
    pipe([() => payload, ecs().runTask])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#stopTask-property
  const destroy = client.destroy({
    pickId,
    method: "stopTask",
    getById,
    ignoreErrorCodes,
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
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
          Tags,
        }),
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    managedByOther,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};
