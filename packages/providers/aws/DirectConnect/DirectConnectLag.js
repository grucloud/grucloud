const assert = require("assert");
const { pipe, tap, get, pick, assign, eq, not, omit } = require("rubico");
const { defaultsDeep, identity, pluck, isIn } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  inferRequestMACSec,
  deleteSecrets,
} = require("./DirectConnectCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ lagId }) => {
    assert(lagId);
  }),
  pick(["lagId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      arn: pipe([
        ({ lagId }) =>
          `arn:aws:directconnect:${
            config.region
          }:${config.accountId()}:dxlag/${lagId}`,
      ]),
    }),
    inferRequestMACSec,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html
exports.DirectConnectLag = ({ compare }) => ({
  type: "Lag",
  package: "direct-connect",
  client: "DirectConnect",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "lagId",
    "ownerAccount",
    "lagState",
    "awsLogicalDeviceId",
    "connections",
    "awsDevice",
    "awsDeviceV2",
    "macSecCapable",
    "encryptionMode",
    "hasLogicalRedundancy",
    "jumboFrameCapable",
    "region",
    "minimumLinks",
    "connectionId",
    "macSecKeys",
  ],
  inferName: () =>
    pipe([
      get("lagName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("lagName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("lagId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    connections: {
      type: "Connection",
      group: "DirectConnect",
      list: true,
      dependencyIds: () => pipe([get("connections"), pluck("connectionId")]),
    },
  },
  compare: compare({
    filterAll: () =>
      pipe([omit(["numberOfConnections"]), omit(["requestMACSec"])]),
  }),
  ignoreErrorCodes: ["DirectConnectClientException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#describeLags-property
  getById: {
    method: "describeLags",
    getField: "lags",
    pickId,
    decorate,
  },
  getList: {
    method: "describeLags",
    getParam: "lags",
    decorate,
    filterResource: pipe([not(eq(get("lagState"), "deleted"))]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#createLag-property
  create: {
    method: "createLag",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("lagState"), isIn(["down", "available"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#updateLag-property
  update: {
    method: "updateLag",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#deleteLag-property
  destroy: {
    postDestroy: deleteSecrets,
    method: "deleteLag",
    pickId,
    isInstanceDown: pipe([eq(get("lagState"), "deleted")]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { connections },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(connections);
        assert(connections[0]);
      }),
      () => otherProps,
      defaultsDeep({
        connectionId: getField(connections[0], "connectionId"),
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
