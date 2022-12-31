const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
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
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html
exports.IVSStreamKey = ({ compare }) => ({
  type: "StreamKey",
  package: "ivs",
  client: "Ivs",
  propertiesDefault: {},
  omitProperties: ["arn", "channelArn"],
  inferName: () =>
    pipe([
      get("value"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("value"),
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
    channel: {
      type: "Channel",
      group: "IVS",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("channelArn")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#getStreamKey-property
  getById: {
    method: "getStreamKey",
    getField: "streamKey",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#listStreamKeys-property
  getList: {
    method: "listStreamKeys",
    getParam: "streamKeys",
    decorate: ({ getById }) => pipe([getById]),
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Channel", group: "IVS" },
          pickKey: pipe([({ arn }) => ({ channelArn: arn })]),
          method: "listStreamKeys",
          getParam: "streamKeys",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#createStreamKey-property
  create: {
    method: "createStreamKey",
    pickCreated: ({ payload }) => pipe([get("streamKey")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#deleteStreamKey-property
  destroy: {
    method: "deleteStreamKey",
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
    properties: { channel, tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        channelArn: getField(channel, "arn"),
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
