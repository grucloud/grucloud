const assert = require("assert");
const { pipe, tap, get, pick, assign, map, eq } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { replaceWithName } = require("@grucloud/core/Common");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./MediaLiveCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ InputId }) => {
    assert(InputId);
  }),
  pick(["InputId"]),
]);

const toInputId = ({ Id, ...other }) => ({ InputId: Id, ...other });

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toInputId,
    ({ SecurityGroups, ...other }) => ({
      InputSecurityGroups: SecurityGroups,
      ...other,
    }),
    omitIfEmpty([
      "InputDevices",
      "InputPartnerIds",
      "MediaConnectFlows",
      "Sources",
    ]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html
exports.MediaLiveInput = () => ({
  type: "Input",
  package: "medialive",
  client: "MediaLive",
  propertiesDefault: {},
  omitProperties: [
    "RoleArn",
    "InputId",
    "Arn",
    "State",
    "Vpc",
    "PipelinesRunningCount",
    "PipelineDetails",
    "Destinations",
    "AttachedChannels",
    "InputSecurityGroups",
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
      tap((params) => {
        assert(true);
      }),
      get("InputId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        MediaConnectFlows: pipe([
          get("MediaConnectFlows"),
          map(
            assign({
              FlowArn: pipe([
                get("FlowArn"),
                replaceWithName({
                  groupType: "MediaConnect::Flow",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("RoleArn")]),
    },
    inputSecurityGroups: {
      type: "InputSecurityGroup",
      group: "MediaLive",
      list: true,
      dependencyIds: ({ lives, config }) => get("InputSecurityGroups"),
    },
    mediaConnectFlows: {
      type: "Flow",
      group: "MediaConnect",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("MediaConnectFlows"), pluck("FlowArn")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("Vpc.SubnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("Vpc.SecurityGroupIds"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#describeInput-property
  getById: {
    method: "describeInput",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#listInputs-property
  getList: {
    method: "listInputs",
    getParam: "Inputs",
    decorate: ({ getById }) => pipe([toInputId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#createInput-property
  create: {
    method: "createInput",
    pickCreated: ({ payload }) => pipe([get("Input"), toInputId]),
    shouldRetryOnExceptionMessages: ["MediaLive was denied access to this"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#updateInput-property
  update: {
    method: "updateInput",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#deleteInput-property
  destroy: {
    method: "deleteInput",
    pickId,
    isInstanceDown: pipe([
      tap((params) => {
        assert(true);
      }),
      eq(get("State"), "DELETED"),
    ]),
    shouldRetryOnExceptionMessages: ["is busy, it cannot be deleted"],
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
    dependencies: { iamRole, inputSecurityGroups, securityGroups, subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        InputSecurityGroups: pipe([
          () => inputSecurityGroups,
          map((sg) => getField(sg, "InputSecurityGroupId")),
        ])(),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(() => iamRole, assign({ RoleArn: () => getField(iamRole, "Arn") })),
      when(
        () => subnets,
        defaultsDeep({
          Vpc: {
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          Vpc: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          },
        })
      ),
    ])(),
});
