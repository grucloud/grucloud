const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, identity, callProp, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./EMRCommon");

const buildArn = () =>
  pipe([
    get("StudioId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ StudioId }) => {
    assert(StudioId);
  }),
  pick(["StudioId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html
exports.EMRStudio = () => ({
  type: "Studio",
  package: "emr",
  client: "EMR",
  propertiesDefault: {},
  omitProperties: [
    "StudioId",
    "StudioArn",
    "EngineSecurityGroupId",
    "ServiceRole",
    "UserRole",
    "VpcId",
    "SubnetIds",
    "WorkspaceSecurityGroupId",
    "CreationTime",
    "Url",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("StudioArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "ValidationException",
    "InvalidRequestException",
  ],
  dependencies: {
    serviceRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("ServiceRole")]),
    },
    userRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("UserRole")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    engineSecurityGroup: {
      type: "SecurityGroup",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("EngineSecurityGroupId"),
    },
    workspaceSecurityGroup: {
      type: "SecurityGroup",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("WorkspaceSecurityGroupId"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("DefaultS3Location"), callProp("replace", "s3://", "")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#describeStudio-property
  getById: {
    method: "describeStudio",
    getField: "Studio",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#listStudios-property
  getList: {
    method: "listStudios",
    getParam: "Studios",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#createStudio-property
  create: {
    method: "createStudio",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#updateStudio-property
  update: {
    method: "updateStudio",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#deleteStudio-property
  destroy: {
    method: "deleteStudio",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      serviceRole,
      userRole,
      vpc,
      subnets,
      engineSecurityGroup,
      workspaceSecurityGroup,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => serviceRole,
        defaultsDeep({
          ServiceRole: getField(serviceRole, "Arn"),
        })
      ),
      when(
        () => userRole,
        defaultsDeep({
          UserRole: getField(userRole, "Arn"),
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
      when(
        () => engineSecurityGroup,
        defaultsDeep({
          EngineSecurityGroupId: getField(engineSecurityGroup, "GroupId"),
        })
      ),
      when(
        () => workspaceSecurityGroup,
        defaultsDeep({
          WorkspaceSecurityGroupId: getField(workspaceSecurityGroup, "GroupId"),
        })
      ),
      when(
        () => vpc,
        defaultsDeep({
          VpcId: getField(vpc, "VpcId"),
        })
      ),
    ])(),
});
