const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ GatewayARN }) => {
    assert(GatewayARN);
  }),
  pick(["GatewayARN"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html
exports.StorageGatewayCache = () => ({
  type: "Cache",
  package: "storage-gateway",
  client: "StorageGateway",
  cannotBeDeleted: () => () => true,
  propertiesDefault: {},
  omitProperties: ["GatewayARN"],
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
      get("GatewayARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidGatewayRequestException",
  ],
  dependencies: {
    gateway: {
      type: "Gateway",
      group: "StorageGateway",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("GatewayARN")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#describeCache-property
  getById: {
    method: "describeCache",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#describeCache-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Gateway", group: "StorageGateway" },
          pickKey: pipe([pick(["GatewayARN"])]),
          method: "describeCache",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.GatewayARN);
              }),
              defaultsDeep({ GatewayARN: parent.GatewayARN }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#addCache-property
  create: {
    method: "addCache",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#deleteCache-property
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { gateway },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(gateway);
      }),
      () => otherProps,
      defaultsDeep({ GatewayARN: getField(gateway, "GatewayARN") }),
    ])(),
});
