const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ ConnectionId }) => {
    assert(ConnectionId);
  }),
  pick(["ConnectionId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html
exports.OpenSearchOutboundConnection = () => ({
  type: "OutboundConnection",
  package: "opensearch",
  client: "OpenSearch",
  propertiesDefault: {},
  omitProperties: ["ConnectionStatus", "ConnectionId", "ConnectionProperties"],
  inferName: () =>
    pipe([
      get("ConnectionAlias"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ConnectionAlias"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ConnectionId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#describeOutboundConnections-property
  getById: {
    method: "describeOutboundConnections",
    getField: "Connections",
    pickId: pipe([
      tap(({ ConnectionId }) => {
        assert(ConnectionId);
      }),
      ({ ConnectionId }) => ({
        Filters: [{ Name: "connection-id", Values: [ConnectionId] }],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#describeOutboundConnections-property
  getList: {
    method: "describeOutboundConnections",
    getParam: "Connections",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#createOutboundConnection-property
  create: {
    method: "createOutboundConnection",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([
      get("ConnectionStatus.StatusCode"),
      isIn(["PENDING_ACCEPTANCE", "APPROVED", "ACTIVE"]),
    ]),
    isInstanceError: pipe([
      get("ConnectionStatus.StatusCode"),
      isIn(["FAILED"]),
    ]),
    getErrorMessage: pipe([get("ConnectionStatus.Message", "FAILED")]),
  },
  // No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#deleteOutboundConnection-property
  destroy: {
    method: "deleteOutboundConnection",
    pickId,
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
