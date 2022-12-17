const assert = require("assert");
const { pipe, tap, get, pick, assign, eq, not } = require("rubico");
const { defaultsDeep, identity, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./DirectConnectCommon");

// TODO ownerAccount managedByOther

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ connectionId }) => {
    assert(connectionId);
  }),
  pick(["connectionId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      arn: pipe([
        ({ connectionId }) =>
          `arn:aws:directconnect:${
            config.region
          }:${config.accountId()}:dxcon/${connectionId}`,
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html
exports.DirectConnectConnection = ({ compare }) => ({
  type: "Connection",
  package: "direct-connect",
  client: "DirectConnect",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "connectionState",
    "connectionId",
    "ownerAccount",
    "lagId",
    "awsLogicalDeviceId",
    "portEncryptionStatus",
    "macSecKeys",
    "jumboFrameCapable",
    "macSecCapable",
    "hasLogicalRedundancy",
    "region",
    "awsDevice",
    "awsDeviceV2",
    "encryptionMode",
  ],
  inferName: () =>
    pipe([
      get("connectionName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("connectionName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("connectionId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {},
  ignoreErrorCodes: ["DirectConnectClientException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#describeConnections-property
  getById: {
    method: "describeConnections",
    getField: "connections",
    pickId,
    decorate,
  },
  getList: {
    filterResource: pipe([not(eq(get("connectionState"), "deleted"))]),
    method: "describeConnections",
    getParam: "connections",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#createConnection-property
  create: {
    method: "createConnection",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("connectionState"), "requested")]),
    configIsUp: { retryCount: 40 * 12, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#updateConnection-property
  update: {
    method: "updateConnection",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#deleteConnection-property
  destroy: {
    method: "deleteConnection",
    pickId,
    isInstanceDown: pipe([eq(get("connectionState"), "deleted")]),
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
