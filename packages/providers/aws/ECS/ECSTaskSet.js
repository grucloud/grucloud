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
} = require("rubico");
const { defaultsDeep, isEmpty, includes, first } = require("rubico/x");

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

const findId = get("live.taskArn");
const findName = get("live.serviceName");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSTaskSet = ({ spec, config }) => {
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "Cluster",
      group: "ecs",
      ids: [pipe([() => live, get("clusterArn")])()],
    },
    {
      type: "Service",
      group: "ecs",
      ids: [pipe([() => live, get("serviceArn")])()],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  const isInvalidArn = pipe([
    tap((params) => {
      assert(true);
    }),
    eq(
      get("message"),
      "The specified capacity provider does not exist. Specify a valid name or ARN and try again."
    ),
  ]);
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskSets-property
  const describeTaskSets = pipe([
    tap((params) => {
      assert(true);
    }),
    ecs().describeTaskSets,
    get("services"),
    tap((params) => {
      assert(true);
    }),
  ]);

  const getByName = ({ name }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(name);
        }),
        () => ({ services: [name] }),
        describeTaskSets,
        first,
        tap((params) => {
          assert(true);
        }),
      ]),
      switchCase([
        isInvalidArn,
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskSets-property
  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Service",
          group: "ecs",
        }),
      flatMap(
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("live"),
          tap((params) => {
            assert(true);
          }),
          ({ clusterArn, serviceName }) => ({
            cluster: clusterArn,
            service: serviceName,
          }),
          ecs().listTasks,
          get("taskArns"),
          (tasks) => ({ tasks }),
          // describeTaskSets ?
          describeTaskSets,
        ])
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

  const isUpByName = pipe([getByName, not(isEmpty)]);
  const isDownByName = pipe([getByName, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createTaskSet-property
  const create = ({ payload, name, namespace }) =>
    pipe([
      () => payload,
      ecs().createTaskSet,
      // tap(() =>
      //   retryCall({
      //     name: `createTaskSet isUpByName: ${name}`,
      //     fn: () => isUpByName({ name }),
      //   })
      // ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteTaskSet-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      tap(({ cluster, service, taskSet }) => {
        assert(cluster);
        assert(service);
        assert(taskSet);
      }),
      ({ serviceName }) => ({ service: serviceName }),
      tryCatch(
        pipe([
          ecs().deleteTaskSet,
          // () =>
          //   retryCall({
          //     name: `deleteTaskSet isDownByName: ${live.taskSet}`,
          //     fn: () => isDownByName({ name: live.taskSet }),
          //     config,
          //   }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(`error deleteTaskSet ${tos({ params, error })}`);
            }),
            () => error,
            switchCase([
              isInvalidArn,
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
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
