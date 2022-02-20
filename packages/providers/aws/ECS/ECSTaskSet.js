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
  filter,
  flatMap,
  pick,
} = require("rubico");
const { defaultsDeep, isEmpty, first, pluck, when } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "ECSTaskSet",
});
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const findId = get("live.taskSetArn");
const findName = get("live.taskDefinition");
const pickId = pick(["cluster", "service", "taskSet"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSTaskSet = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "Cluster",
      group: "ECS",
      ids: [pipe([() => live, get("clusterArn")])()],
    },
    {
      type: "Service",
      group: "ECS",
      ids: [pipe([() => live, get("serviceArn")])()],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  const ignoreErrorCodes = [
    "ClusterNotFoundException",
    "InvalidParameterException",
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskSets-property
  const describeTaskSets = (params = {}) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => params,
      defaultsDeep({ include: ["TAGS"] }),
      ecs().describeTaskSets,
      tap((params) => {
        assert(true);
      }),
      get("taskSets"),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getById = client.getById({
    pickId,
    method: "describeTaskSets",
    getField: "taskSets",
    extraParams: { include: ["TAGS"] },
    ignoreErrorCodes,
  });

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskSets-property
  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Service",
          group: "ECS",
        }),
      flatMap(
        pipe([
          get("live"),
          switchCase([
            get("taskSets"),
            pipe([
              ({ clusterArn, serviceName, taskSets = [] }) => ({
                cluster: clusterArn,
                service: serviceName,
                taskSets: pluck("taskSetArn")(taskSets),
              }),
              describeTaskSets,
              tap((params) => {
                assert(true);
              }),
            ]),
            () => [],
          ]),
        ])
      ),
      filter(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

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
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
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
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
