const assert = require("assert");
const { pipe, tap, get, pick, eq, tryCatch } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint } = require("../AwsCommon");

const { Tagger } = require("./MediaConvertCommon");

const cannotBeDeleted = () => pipe([eq(get("Name"), "Default")]);

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

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html
exports.MediaConvertQueue = () => ({
  type: "Queue",
  package: "mediaconvert",
  client: "MediaConvert",
  propertiesDefault: {},
  omitProperties: [],
  setup: ({ config }) =>
    pipe([
      () => config,
      createEndpoint("mediaconvert", "MediaConvert"),
      tap((endpoint) => {
        assert(endpoint);
      }),
      (endpoint) =>
        tryCatch(
          pipe([
            () => ({
              Mode: "DEFAULT",
            }),
            endpoint().describeEndpoints,
            get("Endpoints"),
            first,
            get("Url"),
            (endpoint) => ({ endpoint }),
            tap((url) => {
              assert(url);
            }),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
            ])()
        )(),
    ])(),
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
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#getQueue-property
  getById: {
    method: "getQueue",
    getField: "Queue",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#listQueues-property
  getList: {
    method: "listQueues",
    getParam: "Queues",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#createQueue-property
  create: {
    method: "createQueue",
    pickCreated: ({ payload }) => pipe([get("Queue")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#updateQueue-property
  update: {
    method: "updateQueue",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#deleteQueue-property
  destroy: {
    method: "deleteQueue",
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
