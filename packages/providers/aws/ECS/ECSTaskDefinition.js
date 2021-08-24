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
  prefix: "ECSTaskDefinition",
});
const { getByNameCore } = require("@grucloud/core/Common");

const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
  findNameInTagsOrId,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.taskDefinitionArn");
const findName = get("live.family");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSTaskDefinition = ({ spec, config }) => {
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live }) => [
    // efsVolumeConfiguration
    // fsxWindowsFileServerVolumeConfiguration
    {
      type: "Role",
      group: "iam",
      ids: [live.taskRoleArn, live.executionRoleArn],
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
    eq(get("message"), "The specified task definition does not exist."),
  ]);

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listTaskDefinitions-property
  const listTaskDefinitions = (params = {}) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => params,
      defaultsDeep({ sort: "DESC" }),
      ecs().listTaskDefinitions,
      get("taskDefinitionArns"),
      map(
        pipe([
          (taskDefinition) => ({ taskDefinition, include: ["TAGS"] }),
          //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskDefinition-property
          ecs().describeTaskDefinition,
          ({ taskDefinition, tags }) => ({ ...taskDefinition, tags }),
        ])
      ),
    ])();

  const getList = ({ lives }) => pipe([listTaskDefinitions])();

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        assert(name);
      }),
      () => ({ familyPrefix: name }),
      listTaskDefinitions,
      tap((params) => {
        assert(true);
      }),
      first,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#registerTaskDefinition-property
  const create = ({ payload, name, namespace }) =>
    pipe([() => payload, ecs().registerTaskDefinition])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deregisterTaskDefinition-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      tap((params) => {
        assert(true);
      }),
      ({ taskDefinitionArn }) => ({ taskDefinition: taskDefinitionArn }),
      tap(({ taskDefinition }) => {
        assert(taskDefinition);
      }),
      tryCatch(pipe([ecs().deregisterTaskDefinition]), (error, params) =>
        pipe([
          tap(() => {
            logger.error(
              `error deregisterTaskDefinition ${tos({ params, error })}`
            );
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
    dependencies: { taskRole, executionRole },
  }) =>
    pipe([
      tap(() => {}),
      () => otherProps,
      defaultsDeep({
        family: name,
        ...(taskRole && { taskRoleArn: getField(taskRole, "Arn") }),
        ...(executionRole && {
          executionRoleArn: getField(executionRole, "Arn"),
        }),
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
    update: create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
