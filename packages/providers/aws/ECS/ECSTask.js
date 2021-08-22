const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  not,
  pick,
  flatMap,
  filter,
} = require("rubico");
const { defaultsDeep, isEmpty, unless, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "ECSTask",
});
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore } = require("@grucloud/core/Common");

const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
  findNameInTagsOrId,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.taskArn");
const findName = findNameInTagsOrId({ findId });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSTask = ({ spec, config }) => {
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "Cluster",
      group: "ecs",
      ids: [live.clusterArn],
    },
    {
      type: "TaskDefinition",
      group: "ecs",
      ids: [live.taskDefinitionArn],
    },
    {
      type: "ContainerInstance",
      group: "ecs",
      ids: [live.containerInstanceArn],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  const isNotFound = pipe([
    tap((params) => {
      assert(true);
    }),
    eq(get("code"), "ClusterNotFoundException"),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTasks-property
  const describeTasks = pipe([
    tap(({ tasks, cluster }) => {
      assert(Array.isArray(tasks));
      assert(cluster);
    }),
    defaultsDeep({ include: ["TAGS"] }),
    ecs().describeTasks,
    get("tasks"),
    tap((tasks) => {
      logger.debug(`describeTasks ${tos(tasks)}`);
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listTasks-property
  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Cluster",
          group: "ecs",
        }),
      flatMap(
        pipe([
          get("id"),
          (cluster) =>
            pipe([
              () => ({ cluster }),
              ecs().listTasks,
              get("taskArns"),
              unless(
                isEmpty,
                pipe([(tasks) => ({ cluster, tasks }), describeTasks])
              ),
            ])(),
        ])
      ),
      filter(not(isEmpty)),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#runTask-property
  const create = ({ payload, name, namespace }) =>
    pipe([() => payload, ecs().runTask])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#stopTask-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      ({ taskArn, clusterArn }) => ({ task: taskArn, cluster: clusterArn }),
      tap(({ task, cluster }) => {
        assert(task);
        assert(cluster);
      }),
      tryCatch(pipe([ecs().stopTask]), (error, params) =>
        pipe([
          tap(() => {
            logger.error(`error stopTask ${tos({ params, error })}`);
          }),
          () => error,
          switchCase([
            isNotFound,
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
    dependencies: { cluster, taskDefinition, subnets, securityGroups = [] },
  }) =>
    pipe([
      tap(() => {
        assert(cluster, "missing 'cluster' dependency");
        assert(taskDefinition, "missing 'taskDefinition' dependency");
        //assert(subnets, "missing 'subnets' dependency");
        //assert(securityGroups, "missing 'securityGroups' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        referenceId: name,
        cluster: getField(cluster, "clusterArn"),
        taskDefinition: `${getField(taskDefinition, "family")}:${getField(
          taskDefinition,
          "revision"
        )}`,
        // networkConfiguration: {
        //   awsvpcConfiguration: {
        //     subnets: pluck((subnet) => getField(subnet, "SubnetId"))(subnets),
        //     securityGroups: pluck((securityGroup) =>
        //       getField(securityGroup, "GroupId")
        //     )(securityGroups),
        //   },
        // },
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
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
