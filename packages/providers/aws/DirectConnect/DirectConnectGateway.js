const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

// TODO ownerAccount managedByOther

const pickId = pipe([
  tap(({ directConnectGatewayId }) => {
    assert(directConnectGatewayId);
  }),
  pick(["directConnectGatewayId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html
exports.DirectConnectGateway = () => ({
  type: "Gateway",
  package: "direct-connect",
  client: "DirectConnect",
  propertiesDefault: {},
  omitProperties: [
    "ownerAccount",
    "directConnectGatewayId",
    "directConnectGatewayState",
    "stateChangeError",
  ],
  inferName: () =>
    pipe([
      get("directConnectGatewayName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("directConnectGatewayName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("directConnectGatewayId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {},
  ignoreErrorCodes: ["DirectConnectClientException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#describeDirectConnectGateways-property
  getById: {
    method: "describeDirectConnectGateways",
    getField: "directConnectGateways",
    pickId,
    decorate,
  },
  getList: {
    method: "describeDirectConnectGateways",
    getParam: "directConnectGateways",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#createDirectConnectGateway-property
  create: {
    method: "createDirectConnectGateway",
    pickCreated: ({ payload }) => pipe([get("directConnectGateway")]),
    isInstanceUp: pipe([eq(get("directConnectGatewayState"), "available")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#updateDirectConnectGateway-property
  update: {
    method: "updateDirectConnectGateway",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#deleteDirectConnectGateway-property
  destroy: {
    method: "deleteDirectConnectGateway",
    pickId,
    isInstanceDown: pipe([eq(get("directConnectGatewayState"), "deleted")]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
