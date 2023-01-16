const assert = require("assert");
const { pipe, tap, get, pick, eq, tryCatch } = require("rubico");
const { defaultsDeep, first, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint } = require("../AwsCommon");

const { Tagger, assignTags } = require("./MediaConvertCommon");

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

const decorate = ({ endpoint, config, endpointConfig }) =>
  pipe([
    tap((params) => {
      assert(endpointConfig);
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint, endpointConfig }),
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html
exports.MediaConvertQueue = () => ({
  type: "Queue",
  package: "mediaconvert",
  client: "MediaConvert",
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
  setup: ({ config }) =>
    pipe([
      () => config,
      createEndpoint("mediaconvert", "MediaConvert"),
      (endpoint) =>
        pipe([
          () => ({
            Mode: "DEFAULT",
          }),
          endpoint().describeEndpoints,
          get("Endpoints"),
          first,
          get("Url"),
          tap((url) => {
            assert(url);
          }),
          (endpoint) => ({ endpoint }),
        ])(),
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
  getEndpointConfig: identity,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#getQueue-property
  getById: {
    getEndpointConfig: identity,
    method: "getQueue",
    getField: "Queue",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#listQueues-property
  getList: {
    getEndpointConfig: identity,
    method: "listQueues",
    getParam: "Queues",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#createQueue-property
  create: {
    getEndpointConfig: identity,
    method: "createQueue",
    pickCreated: ({ payload }) => pipe([get("Queue")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#updateQueue-property
  update: {
    getEndpointConfig: identity,
    method: "updateQueue",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#deleteQueue-property
  destroy: {
    getEndpointConfig: identity,
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
