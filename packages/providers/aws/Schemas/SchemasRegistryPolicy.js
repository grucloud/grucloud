const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { assignPolicyAccountAndRegion } = require("../AwsCommon");

const { ignoreErrorCodes } = require("./SchemasCommon");

const pickId = pipe([
  tap(({ RegistryName }) => {
    assert(RegistryName);
  }),
  pick(["RegistryName"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.RegistryName);
    }),
    defaultsDeep({ RegistryName: live.RegistryName }),
    assign({ Policy: pipe([get("Policy"), JSON.parse]) }),
  ]);

const filterPayload = pipe([
  assign({ Policy: pipe([get("Policy"), JSON.stringify]) }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html
exports.SchemasRegistryPolicy = () => ({
  type: "RegistryPolicy",
  package: "schemas",
  client: "Schemas",
  propertiesDefault: {},
  omitProperties: ["RegistryName"],
  inferName:
    ({ registry }) =>
    ({}) =>
      pipe([
        tap((name) => {
          assert(registry);
        }),
        () => `${registry}`,
      ]),
  findName:
    () =>
    ({ RegistryName }) =>
      pipe([
        tap((name) => {
          assert(RegistryName);
        }),
        () => `${RegistryName}`,
      ]),
  findId: () =>
    pipe([
      get("RegistryName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Policy: pipe([
          get("Policy"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    registry: {
      type: "Registry",
      group: "EventSchemas",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("RegistryName"),
          tap((RegistryName) => {
            assert(RegistryName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#getSchema-property
  getById: {
    method: "getResourcePolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#listSchemas-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Registry", group: "EventSchemas" },
          pickKey: pipe([
            pick(["RegistryName"]),
            tap(({ RegistryName }) => {
              assert(RegistryName);
            }),
          ]),
          method: "getResourcePolicy",
          config,
          decorate: ({ parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#putResourcePolicy-property
  create: {
    filterPayload,
    method: "putResourcePolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#putResourcePolicy-property
  update: {
    method: "putResourcePolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#deleteResourcePolicy-property
  destroy: {
    method: "deleteResourcePolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { registry },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(registry);
      }),
      () => otherProps,
      defaultsDeep({
        RegistryName: getField(registry, "Name"),
      }),
    ])(),
});
