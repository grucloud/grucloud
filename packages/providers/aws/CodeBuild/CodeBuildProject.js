const assert = require("assert");
const { pipe, map, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");

const model = ({ config }) => ({
  package: "codebuild",
  client: "CodeBuild",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#batchGetProjects-property
  getById: {
    method: "batchGetProjects",
    pickId: ({ name }) => ({ names: [name] }),
    getField: "projects",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#listProjects-property
  getList: {
    method: "listProjects",
    getParam: "projects",
    decorate: ({ getById }) => pipe([(name) => ({ name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#createProject-property
  create: {
    method: "createProject",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    shouldRetryOnExceptionMessages: ["CodeBuild is not authorized to perform"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#updateProject-property
  update: {
    method: "updateProject",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#deleteProject-property
  destroy: { method: "deleteProject", pickId: pick(["name"]) },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html
exports.CodeBuildProject = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.name")]),
    findId: pipe([get("live.arn")]),
    getByName: ({ getById }) => pipe([getById({})]),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: { serviceRole, vpc, subnets, securityGroups },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          serviceRole: getField(serviceRole, "Arn"),
          tags: buildTags({
            name,
            config,
            namespace,
            UserTags: tags,
            key: "key",
            value: "value",
          }),
        }),
        when(
          () => vpc,
          defaultsDeep({ VpcConfig: { vpcId: getField(vpc, "VpcId") } })
        ),
        when(
          () => subnets,
          defaultsDeep({
            VpcConfig: {
              subnets: pipe([
                () => subnets,
                map((subnet) => getField(subnet, "SubnetId")),
              ])(),
            },
          })
        ),
        when(
          () => securityGroups,
          defaultsDeep({
            VpcConfig: {
              securityGroupIds: pipe([
                () => securityGroups,
                map((securityGroup) => getField(securityGroup, "GroupId")),
              ])(),
            },
          })
        ),
      ])(),
  });
