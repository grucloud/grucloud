const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger } = require("./IVSCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ arn }) => {
    assert(arn);
  }),
  pick(["arn"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      streamKeys: pipe([
        ({ arn }) => ({ channelArn: arn }),
        endpoint().listStreamKeys,
        get("streamKeys"),
        map(pipe([endpoint().getStreamKey, get("streamKey")])),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html
exports.IVSChannel = ({ compare }) => ({
  type: "Channel",
  package: "ivs",
  client: "Ivs",
  propertiesDefault: {
    authorized: false,
    latencyMode: "LOW",
    type: "STANDARD",
  },
  omitProperties: [
    "arn",
    "ingestEndpoint",
    "playbackUrl",
    "recordingConfigurationArn",
    "streamKeys",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    recordingConfiguration: {
      type: "RecordingConfiguration",
      group: "IVS",
      dependencyId: ({ lives, config }) =>
        pipe([get("recordingConfigurationArn")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#getChannel-property
  getById: {
    method: "getChannel",
    getField: "channel",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#listChannels-property
  getList: {
    method: "listChannels",
    getParam: "channels",
    decorate: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#createChannel-property
  create: {
    method: "createChannel",
    pickCreated: ({ payload }) => pipe([get("channel")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#updateChannel-property
  update: {
    method: "updateChannel",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#deleteChannel-property
  destroy: {
    method: "deleteChannel",
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
    properties: { tags, ...otherProps },
    dependencies: { recordingConfiguration },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => recordingConfiguration,
        defaultsDeep({
          recordingConfigurationArn: getField(recordingConfiguration, "arn"),
        })
      ),
    ])(),
});
