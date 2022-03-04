const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createECS, buildTagsEcs } = require("./ECSCommon");

const findId = get("live.taskDefinitionArn");
const findName = get("live.family");
const pickId = pipe([
  tap(({ taskDefinitionArn }) => {
    assert(taskDefinitionArn);
  }),
  ({ taskDefinitionArn }) => ({
    taskDefinition: taskDefinitionArn,
  }),
]);

const ignoreErrorMessages = ["The specified task definition does not exist."];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSTaskDefinition = ({ spec, config }) => {
  const ecs = createECS(config);
  const client = AwsClient({ spec, config })(ecs);

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

  const getById = client.getById({
    pickId: pipe([
      tap(({ taskDefinitionArn }) => {
        assert(taskDefinitionArn);
      }),
      ({ taskDefinitionArn }) => ({ taskDefinition: taskDefinitionArn }),
    ]),
    extraParams: { include: ["TAGS"] },
    method: "describeTaskDefinition",
    ignoreErrorMessages,
    decorate: () =>
      pipe([({ taskDefinition, tags }) => ({ ...taskDefinition, tags })]),
  });

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listTaskDefinitions-property
  const getList = client.getList({
    method: "listTaskDefinitions",
    getParam: "taskDefinitionArns",
    extraParam: { sort: "DESC" },
    decorate: () =>
      pipe([(taskDefinitionArn) => ({ taskDefinitionArn }), getById]),
  });
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskDefinition-property

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        assert(name);
      }),
      () => ({ familyPrefix: name }),
      getList,
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
    ignoreErrorMessages,
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
    getByName,
    findName,
    create,
    update: create,
    destroy,
    getList,
    configDefault,
  };
};
