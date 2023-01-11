const assert = require("assert");
const { pipe, tap, get, assign, map, pick } = require("rubico");
const { defaultsDeep, when, isIn } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./AppStreamCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => live,
      JSON.stringify,
      JSON.parse,
      //omitIfEmpty(["instanceMetadataOptions", "logging.s3Logs", "logging"]),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamImageBuilder = () => ({
  type: "ImageBuilder",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: {},
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
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "IamRoleArn",
    "VpcConfig",
    "State",
    "StateChangeReason",
    "CreatedTime",
    "NetworkAccessConfiguration",
    "ImageBuilderErrors",
    "AccessEndpoints.VpceId",
  ],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("IamRoleArn")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcConfig.SecurityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcConfig.SubnetIds"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) => pipe([assign({})]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeImageBuilders-property
  getById: {
    method: "describeImageBuilders",
    getField: "ImageBuilders",
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      ({ Name }) => ({ Names: [Name] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeImageBuilders-property
  getList: {
    method: "describeImageBuilders",
    getParam: "ImageBuilders",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#createImageBuilder-property
  create: {
    method: "createImageBuilder",
    pickCreated: ({ payload }) => pipe([get("ImageBuilder")]),
    isInstanceUp: pipe([get("State"), isIn(["RUNNING"])]),
    isInstanceError: pipe([get("State"), isIn(["FAILED"])]),
    getErrorMessage: pipe([get("StateChangeReason.Message", "FAILED")]),
    // TODO retry on IAM role failure
  },
  // No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#deleteImageBuilder-property
  destroy: {
    // TODO preDestroy stopImageBuilder
    method: "deleteImageBuilder",
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
    dependencies: { iamRole, securityGroups, subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          IamRoleArn: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcConfig: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          VpcConfig: {
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
    ])(),
});
