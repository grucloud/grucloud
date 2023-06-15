const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./MediaTailorCommon");

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      Arn: pipe([
        tap(({ Name }) => {
          assert(Name);
        }),
        ({ Name }) =>
          `arn:${config.partition}:mediatailor:${
            config.region
          }:${config.accountId()}:playbackConfiguration/${Name}`,
      ]),
    }),
  ]);

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

const decorate = ({ endpoint, config, endpointConfig }) =>
  pipe([
    tap((params) => {
      assert(endpointConfig);
      assert(endpoint);
    }),
    assignArn({ config }),
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html
exports.MediaTailorPlaybackConfiguration = () => ({
  type: "PlaybackConfiguration",
  package: "mediatailor",
  client: "MediaTailor",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "CreatedAt",
    "LastUpdated",
    "ProgressingJobsCount",
    "Status",
    "SubmittedJobsCount",
    "Type",
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
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  // cannotBeDeleted,
  // managedByOther: cannotBeDeleted,
  ignoreErrorCodes: ["NotFoundException"],
  getEndpointConfig: identity,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#getPlaybackConfiguration-property
  getById: {
    method: "getPlaybackConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#listPlaybackConfigurations-property
  getList: {
    method: "listPlaybackConfigurations",
    getParam: "Items",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#putPlaybackConfiguration-property
  create: {
    method: "putPlaybackConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#updatePlaybackConfiguration-property
  update: {
    method: "putPlaybackConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#deletePlaybackConfiguration-property
  destroy: {
    method: "deletePlaybackConfiguration",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
