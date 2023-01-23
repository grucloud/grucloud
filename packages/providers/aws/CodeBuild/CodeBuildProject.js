const assert = require("assert");
const { pipe, map, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html
exports.CodeBuildProject = ({}) => ({
  type: "Project",
  package: "codebuild",
  client: "CodeBuild",
  inferName: () => pipe([get("name")]),
  findName: () => pipe([get("name")]),
  findId: () => pipe([get("arn")]),
  dependencies: {
    serviceRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("serviceRole"),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("vpcConfig.vpcId", []),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("vpcConfig.subnets", []),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("vpcConfig.securityGroupIds", []),
    },
  },
  omitProperties: [
    "arn",
    "created",
    "encryptionKey",
    "lastModified",
    "serviceRole",
  ],
  propertiesDefault: {
    badge: {
      badgeEnabled: false,
    },
    cache: {
      type: "NO_CACHE",
    },
    source: {
      gitCloneDepth: 1,
      insecureSsl: false,
    },
    projectVisibility: "PRIVATE",
    queuedTimeoutInMinutes: 480,
    secondaryArtifacts: [],
    secondarySourceVersions: [],
    secondarySources: [],
    timeoutInMinutes: 60,
  },
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
  getByName: ({ getById }) => pipe([getById({})]),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { serviceRole, vpc, subnets, securityGroups },
    config,
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
