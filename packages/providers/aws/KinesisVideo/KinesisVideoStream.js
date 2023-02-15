const assert = require("assert");
const { pipe, tap, get, pick, eq, tryCatch, assign } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { createTagger } = require("../AwsTagger");

const Tagger = createTagger({
  methodTagResource: "tagStream",
  methodUnTagResource: "untagStream",
  ResourceArn: "StreamARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeyList",
});

const buildArn = () =>
  pipe([
    get("StreamARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ StreamARN }) => {
    assert(StreamARN);
  }),
  pick(["StreamARN"]),
]);

const assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([pickId, endpoint().listTagsForStream, get("Tags")]),
        (error) => []
      ),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisVideo.html
exports.KinesisVideoStream = () => ({
  type: "Stream",
  package: "kinesis-video",
  client: "KinesisVideo",
  propertiesDefault: {},
  omitProperties: [
    "KmsKeyId",
    "StreamARN",
    "Status",
    "CreationTime",
    "Version",
  ],
  inferName: () =>
    pipe([
      get("StreamName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("StreamName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("StreamARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisVideo.html#describeStream-property
  getById: {
    method: "describeStream",
    getField: "StreamInfo",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisVideo.html#listStreams-property
  getList: {
    method: "listStreams",
    getParam: "StreamInfoList",
    decorate: ({ getById }) => pipe([pickId, getById]),
    //decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisVideo.html#createStream-property
  create: {
    method: "createStream",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: eq(get("Status"), "ACTIVE"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisVideo.html#updateStream-property
  update: {
    method: "updateStream",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisVideo.html#deleteStream-property
  destroy: {
    method: "deleteStream",
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
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
