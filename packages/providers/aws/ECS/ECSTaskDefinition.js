const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.taskDefinitionArn");
const findName = get("live.family");
const pickId = ({ taskDefinitionArn }) => ({
  taskDefinition: taskDefinitionArn,
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSTaskDefinition = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live }) => [
    // efsVolumeConfiguration
    // fsxWindowsFileServerVolumeConfiguration
    {
      type: "Role",
      group: "IAM",
      ids: [live.taskRoleArn, live.executionRoleArn],
    },
  ];

  const findNamespace = pipe([() => ""]);

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
  const create = client.create({
    method: "registerTaskDefinition",
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deregisterTaskDefinition-property

  const destroy = client.destroy({
    pickId,
    method: "deregisterTaskDefinition",
    //getById,
    ignoreErrorCodes: ["InvalidParameterException"],
    ignoreErrorMessages: ["The specified task definition does not exist."],
    config,
  });

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
