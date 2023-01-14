const assert = require("assert");
const { pipe, tap, get, pick, assign, map, eq } = require("rubico");
const { defaultsDeep, when, identity, pluck } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./MediaLiveCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ChannelId }) => {
    assert(ChannelId);
  }),
  pick(["ChannelId"]),
]);

const toChannelId = ({ Id, ...other }) => ({ ChannelId: Id, ...other });

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toChannelId,
    assign({
      Destinations: pipe([
        get("Destinations"),
        map(pipe([omitIfEmpty(["MediaPackageSettings"])])),
      ]),
      EncoderSettings: pipe([
        get("EncoderSettings"),
        map(pipe([omitIfEmpty(["CaptionDescriptions"])])),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html
exports.MediaLiveChannel = () => ({
  type: "Channel",
  package: "medialive",
  client: "MediaLive",
  propertiesDefault: { LogLevel: "DISABLED" },
  omitProperties: [
    "RoleArn",
    "ChannelId",
    "Arn",
    "State",
    "Vpc",
    "PipelinesRunningCount",
    "PipelineDetails",
    "EgressEndpoints",
    "EncoderSettings.MotionGraphicsConfiguration",
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
      get("ChannelId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("RoleArn")]),
    },
    inputs: {
      type: "Input",
      group: "MediaLive",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("InputAttachments"), pluck("InputAttachmentName")]),
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
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        InputAttachments: pipe([
          get("InputAttachments"),
          map(
            assign({
              InputId: pipe([
                get("InputId"),
                replaceWithName({
                  groupType: "MediaLive::Input",
                  path: "live.InputId",
                  pathLive: "live.InputId",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#describeChannel-property
  getById: {
    method: "describeChannel",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#listChannels-property
  getList: {
    method: "listChannels",
    getParam: "Channels",
    decorate: ({ getById }) => pipe([toChannelId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#createChannel-property
  create: {
    method: "createChannel",
    pickCreated: ({ payload }) => pipe([get("Channel"), toChannelId]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#updateChannel-property
  update: {
    method: "updateChannel",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#deleteChannel-property
  destroy: {
    method: "deleteChannel",
    pickId,
    isInstanceDown: pipe([
      tap((params) => {
        assert(true);
      }),
      eq(get("State"), "DELETED"),
    ]),
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
      when(() => iamRole, assign({ RoleArn: getField(iamRole, "Arn") })),
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
