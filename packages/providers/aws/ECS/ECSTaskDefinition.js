const assert = require("assert");
const { map, pipe, tap, get, any } = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  flatten,
  includes,
  find,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createECS,
  buildTagsEcs,
  tagResource,
  untagResource,
} = require("./ECSCommon");

const findId = get("live.taskDefinitionArn");
const findName = get("live.family");

const pickId = pipe([
  ({ taskDefinitionArn }) => ({
    taskDefinition: taskDefinitionArn,
  }),
]);

const ignoreErrorMessages = ["The specified task definition does not exist."];

exports.findDependenciesInEnvironment =
  ({ type, group }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      () =>
        lives.getByType({
          type,
          group,
          providerName: config.providerName,
        }),
      find(({ id }) =>
        pipe([
          () => live,
          get("containerDefinitions"),
          pluck("environment"),
          flatten,
          pluck("value"),
          any(includes(id)),
        ])()
      ),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSTaskDefinition = ({ spec, config }) => {
  const ecs = createECS(config);
  const client = AwsClient({ spec, config })(ecs);

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
    pipe([() => ({ familyPrefix: name }), getList, first])();

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
  //TODO
  const destroy = client.destroy({
    pickId,
    method: "deregisterTaskDefinition",
    //getById,
    ignoreErrorCodes: ["InvalidParameterException"],
    ignoreErrorMessages,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { taskRole, executionRole },
  }) =>
    pipe([
      tap(() => {}),
      () => otherProps,
      //TODO when
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
          tags,
        }),
      }),
    ])();

  return {
    spec,
    findId,
    getByName,
    findName,
    create,
    update: create,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ ecs }),
    untagResource: untagResource({ ecs }),
  };
};
