const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./MediaPackageCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html
exports.MediaPackageOriginEndpoint = () => ({
  type: "OriginEndpoint",
  package: "mediapackage",
  client: "MediaPackage",
  propertiesDefault: {},
  omitProperties: ["Arn", "ChannelId"],
  inferName: () =>
    pipe([
      get("Id"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Id"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    channel: {
      type: "Channel",
      group: "MediaPackage",
      list: true,
      dependencyId: ({ lives, config }) => pipe([get("ChannelId")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#getOriginEndpoint-property
  getById: {
    method: "describeOriginEndpoint",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#listOriginEndpoints-property
  getList: {
    method: "listOriginEndpoints",
    getParam: "OriginEndpoints",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#createOriginEndpoint-property
  create: {
    method: "createOriginEndpoint",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#updateOriginEndpoint-property
  update: {
    method: "updateOriginEndpoint",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaPackage.html#deleteOriginEndpoint-property
  destroy: {
    method: "deleteOriginEndpoint",
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
    dependencies: { channel },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        ChannelId: getField(channel, "Id"),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
