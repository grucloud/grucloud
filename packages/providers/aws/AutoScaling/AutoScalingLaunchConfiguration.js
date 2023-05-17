const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  map,
  assign,
  omit,
  switchCase,
} = require("rubico");
const { defaultsDeep, isEmpty, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  imageDescriptionFromId,
  fetchImageIdFromDescription,
} = require("../EC2/EC2Common");

const { tagResource, untagResource, compare } = require("./AutoScalingCommon");

const { DecodeUserData } = require("../AwsCommon");

const ignoreErrorMessages = ["Launch configuration name not found"];
const ResourceType = "launch-configuration";

const findName = () =>
  pipe([
    get("LaunchConfigurationName"),
    tap((LaunchConfigurationName) => {
      assert(LaunchConfigurationName);
    }),
  ]);

const findId = () =>
  pipe([
    get("LaunchConfigurationARN"),
    tap((LaunchConfigurationARN) => {
      assert(LaunchConfigurationARN);
    }),
  ]);

const pickId = pipe([
  pick(["LaunchConfigurationName"]),
  tap(({ LaunchConfigurationName }) => {
    assert(LaunchConfigurationName);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      Image: imageDescriptionFromId({ config }),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AutoScalingLaunchConfiguration = ({}) => ({
  type: "LaunchConfiguration",
  package: "auto-scaling",
  client: "AutoScaling",
  propertiesDefault: {},
  omitProperties: [],
  inferName: () =>
    pipe([
      get("LaunchConfigurationName"),
      tap((LaunchConfigurationName) => {
        assert(LaunchConfigurationName);
      }),
    ]),
  findName,
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: [
    "LaunchConfigurationARN",
    "KeyName",
    "ClassicLinkVPCSecurityGroups",
    "KernelId",
    "RamdiskId",
    "CreatedTime",
    "ImageId",
    "SecurityGroups",
    "IamInstanceProfile",
  ],
  compare: compare({
    filterLive: () => pipe([omit(["Image"])]),
  }),
  // propertiesDefault: {
  //   EbsOptimized: false,
  //   BlockDeviceMappings: [],
  //   InstanceMonitoring: {
  //     Enabled: true,
  //   },
  // },
  filterLive: () =>
    pipe([omitIfEmpty(["KernelId", "RamdiskId"]), DecodeUserData]),
  dependencies: {
    instanceProfile: {
      type: "InstanceProfile",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("IamInstanceProfile"),
          switchCase([
            isEmpty,
            () => undefined,
            callProp("startsWith", "arn"),
            pipe([
              lives.getById({
                type: "InstanceProfile",
                group: "IAM",
                providerName: config.providerName,
              }),
              get("id"),
            ]),
            pipe([
              lives.getByName({
                type: "InstanceProfile",
                group: "IAM",
                providerName: config.providerName,
              }),
              get("id"),
            ]),
          ]),
        ]),
    },
    keyPair: {
      type: "KeyPair",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("KeyName"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroups"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#getMyResource-property
  getById: {
    pickId: ({ LaunchConfigurationName }) => ({
      LaunchConfigurationNames: [LaunchConfigurationName],
    }),
    method: "describeLaunchConfigurations",
    getField: "LaunchConfigurations",
    ignoreErrorMessages,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#listMyResources-property
  getList: {
    method: "describeLaunchConfigurations",
    getParam: "LaunchConfigurations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#createMyResource-property
  create: {
    method: "createLaunchConfiguration",
    shouldRetryOnExceptionMessages: ["Invalid IamInstanceProfile:"],
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#updateMyResource-property
  update: {
    method: "updateMyResource",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#deleteMyResource-property
  destroy: {
    pickId,
    method: "deleteLaunchConfiguration",
    ignoreErrorMessages,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource: tagResource({
      ResourceType,
      property: "LaunchConfigurationName",
    }),
    untagResource: untagResource({
      ResourceType,
      property: "LaunchConfigurationName",
    }),
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, Image, ...otherProps },
    dependencies: { instanceProfile, securityGroups = [], keyPair },
    config,
  }) =>
    pipe([
      () => Image,
      fetchImageIdFromDescription({ config }),
      (ImageId) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            ImageId,
            ...(instanceProfile && {
              IamInstanceProfile: getField(
                instanceProfile,
                "InstanceProfileName"
              ),
            }),
            ...(keyPair && { KeyName: keyPair.resource.name }),
            SecurityGroups: pipe([
              () => securityGroups,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          }),
          assign({
            UserData: ({ UserData }) =>
              Buffer.from(UserData, "utf-8").toString("base64"),
          }),
        ])(),
    ])(),
});
