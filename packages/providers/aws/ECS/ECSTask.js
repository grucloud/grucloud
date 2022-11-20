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
  tagResource,
  untagResource,
} = require("./ECSCommon");

const findId = () => get("taskArn");
const findName = findNameInTagsOrId({ findId });

const pickId = pipe([
  ({ taskArn, clusterArn }) => ({
    task: taskArn,
    cluster: clusterArn,
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSTask = ({ spec, config }) => {
  const ecs = createECS(config);
  const client = AwsClient({ spec, config })(ecs);

  const managedByOther = () =>
    pipe([get("group"), callProp("startsWith", "service:")]);

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
    ])();

  return {
    spec,
    findId,
    managedByOther,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ ecs }),
    untagResource: untagResource({ ecs }),
  };
};
