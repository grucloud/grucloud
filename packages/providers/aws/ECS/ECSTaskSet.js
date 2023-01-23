const assert = require("assert");
const { pipe, tap, get, switchCase, pick } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const {
  createECS,
  buildTagsEcs,
  tagResource,
  untagResource,
} = require("./ECSCommon");

const findId = () =>
  pipe([
    get("taskSetArn"),
    tap((id) => {
      assert(id);
    }),
  ]);
const findName = () => get("taskDefinition");
const pickId = pick(["cluster", "service", "taskSet"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSTaskSet = ({ spec, config }) => {
  const ecs = createECS(config);
  const client = AwsClient({ spec, config })(ecs);

  const ignoreErrorCodes = [
    "ClusterNotFoundException",
    "InvalidParameterException",
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskSets-property
  const getById = client.getById({
    pickId,
    method: "describeTaskSets",
    getField: "taskSets",
    extraParams: { include: ["TAGS"] },
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskSets-property
  const getList = client.getListWithParent({
    parent: { type: "Service", group: "ECS" },
    pickKey: pipe([({ clusterName }) => ({ cluster: clusterName })]),
    config,
    decorate: ({ lives, parent }) =>
      pipe([
        switchCase([
          get("taskSets"),
          pipe([
            ({ clusterArn, serviceName, taskSets = [] }) => ({
              cluster: clusterArn,
              service: serviceName,
              taskSets: pluck("taskSetArn")(taskSets),
            }),
            getById,
          ]),
          () => [],
        ]),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createTaskSet-property
  const create = client.create({
    method: "createTaskSet",
    //TODO
    // pickCreated: () =>
    //   pipe([
    //     tap(({ Instances }) => {
    //       assert(Instances);
    //     }),
    //     get("Instances"),
    //     first,
    //   ]),
    // pickId,
    // getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteTaskSet-property
  const destroy = client.destroy({
    pickId,
    method: "deleteTaskSet",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { cluster, service },
  }) =>
    pipe([
      tap(() => {
        assert(cluster, "missing 'cluster' dependency");
        assert(service, "missing 'service' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        taskDefinition: name,
        cluster: getField(cluster, "clusterArn"),
        service: getField(service, "serviceArn"),
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
