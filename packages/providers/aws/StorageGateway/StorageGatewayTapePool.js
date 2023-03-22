const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  //assignTags,
} = require("./StorageGatewayCommon");

const buildArn = () =>
  pipe([
    get("PoolARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ PoolARN }) => {
    assert(PoolARN);
  }),
  pick(["PoolARN"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html
exports.StorageGatewayTapePool = () => ({
  type: "TapePool",
  package: "storage-gateway",
  client: "StorageGateway",
  propertiesDefault: {},
  omitProperties: ["PoolARN", "PoolStatus", "RetentionLockTimeInDays"],
  inferName: () =>
    pipe([
      get("PoolName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("PoolName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("PoolARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidGatewayRequestException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#getTapePool-property
  getById: {
    method: "listTapePools",
    getField: "PoolInfos",
    pickId: pipe([
      tap(({ PoolARN }) => {
        assert(PoolARN);
      }),
      ({ PoolARN }) => ({ PoolARNs: [PoolARN] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#listTapePools-property
  getList: {
    method: "listTapePools",
    getParam: "PoolInfos",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#createTapePool-property
  create: {
    method: "createTapePool",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#deleteTapePool-property
  destroy: {
    method: "deleteTapePool",
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
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
