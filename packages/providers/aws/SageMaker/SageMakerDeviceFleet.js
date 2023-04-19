const assert = require("assert");
const { pipe, tap, get, pick, or, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, ignoreErrorCodes } = require("./SageMakerCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("DeviceFleetArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DeviceFleetName }) => {
    assert(DeviceFleetName);
  }),
  pick(["DeviceFleetName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    assign({ EnableIotRoleAlias: pipe([or([get("IotRoleAlias")])]) }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerDeviceFleet = () => ({
  type: "DeviceFleet",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "DeviceFleetArn",
    "CreationTime",
    "LastModifiedTime",
    "RoleArn",
    "IotRoleAlias",
    "OutputConfig.KmsKeyId",
  ],
  inferName: () =>
    pipe([
      get("DeviceFleetName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DeviceFleetName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DeviceFleetArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("OutputConfig.KmsKeyId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeDeviceFleet-property
  getById: {
    method: "describeDeviceFleet",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listDeviceFleets-property
  getList: {
    method: "listDeviceFleets",
    getParam: "DeviceFleetSummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createDeviceFleet-property
  create: {
    method: "createDeviceFleet",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateDeviceFleet-property
  update: {
    method: "updateDeviceFleet",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteDeviceFleet-property
  destroy: {
    method: "deleteDeviceFleet",
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
    dependencies: { kmsKey, iamRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          RoleArn: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          OutputConfig: { KmsKeyId: getField(kmsKey, "Arn") },
        })
      ),
    ])(),
});
