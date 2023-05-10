const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./RekognitionCommon");

const buildArn = () =>
  pipe([
    get("CollectionARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ CollectionId }) => {
    assert(CollectionId);
  }),
  pick(["CollectionId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html
exports.RekognitionCollection = () => ({
  type: "Collection",
  package: "rekognition",
  client: "Rekognition",
  propertiesDefault: {},
  omitProperties: [
    "CollectionARN",
    "CreationTimestamp",
    "FaceModelVersion",
    "FaceCount",
  ],
  inferName: () =>
    pipe([
      get("CollectionId"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("CollectionId"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("CollectionARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#describeCollection-property
  getById: {
    method: "describeCollection",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#listCollections-property
  getList: {
    method: "listCollections",
    getParam: "CollectionIds",
    decorate: ({ getById }) =>
      pipe([(CollectionId) => ({ CollectionId }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#createCollection-property
  create: {
    method: "createCollection",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#deleteCollection-property
  destroy: {
    method: "deleteCollection",
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
