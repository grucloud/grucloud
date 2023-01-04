const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

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
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html
exports.IVSPlaybackKeyPair = ({ compare }) => ({
  type: "PlaybackKeyPair",
  package: "ivs",
  client: "Ivs",
  propertiesDefault: {},
  omitProperties: ["arn"],
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
  dependencies: {},
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#getPlaybackKeyPair-property
  getById: {
    method: "getPlaybackKeyPair",
    getField: "keyPair",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#listPlaybackKeyPairs-property
  getList: {
    method: "listPlaybackKeyPairs",
    getParam: "keyPairs",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#createPlaybackKeyPair-property
  create: {
    method: "createPlaybackKeyPair",
    pickCreated: ({ payload }) => pipe([get("keyPair")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#updatePlaybackKeyPair-property
  update: {
    method: "updatePlaybackKeyPair",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#deletePlaybackKeyPair-property
  destroy: {
    method: "deletePlaybackKeyPair",
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
    properties: { recordingConfiguration, tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        recordingConfigurationArn: getField(recordingConfiguration, "arn"),
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
