const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("bucketName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ bucketName }) => {
    assert(bucketName);
  }),
  pick(["bucketName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailBucket = () => ({
  type: "Bucket",
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["NotFoundException"],
  propertiesDefault: {},
  inferName: () => get("bucketName"),
  findName: () =>
    pipe([
      get("bucketName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("bucketName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "createdAt",
    "arn",
    "url",
    "supportCode",
    "resourceType",
    "ableToUpdateBundle",
    "readonlyAccessAccounts",
    "resourcesReceivingAccess",
    "state",
    "operations",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getBucket-property
  getById: {
    method: "getBuckets",
    getField: "buckets",
    pickId: pipe([pickId, defaultsDeep({ includeConnectedResources: true })]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getBuckets-property
  getList: {
    enhanceParams: () => () => ({ includeConnectedResources: true }),
    method: "getBuckets",
    getParam: "buckets",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createBucket-property
  create: {
    method: "createBucket",
    pickCreated: ({ payload }) => pipe([get("bucket")]),
    isInstanceUp: pipe([eq(get("state.code"), "OK")]),
    isInstanceError: pipe([eq(get("state.code"), "Unknown")]),
    getErrorMessage: get("state.message", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateBucket-property
  update: {
    method: "updateBucket",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteBucket-property
  destroy: {
    method: "deleteBucket",
    pickId: pipe([pickId, defaultsDeep({ forceDelete: true })]),
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ bucketName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
});
