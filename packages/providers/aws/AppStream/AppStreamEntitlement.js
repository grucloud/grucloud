const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ Name, StackName }) => {
    assert(Name);
    assert(StackName);
  }),
  pick(["Name", "StackName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamEntitlement = () => ({
  type: "Entitlement",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: {},
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
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["StackName", "CreatedTime", "LastModifiedTime"],
  dependencies: {
    stack: {
      type: "Stack",
      group: "AppStream",
      parent: true,
      dependencyId: () =>
        pipe([
          get("StackName"),
          tap((StackName) => {
            assert(StackName);
          }),
        ]),
    },
  },
  ignoreErrorCodes: [
    "EntitlementNotFoundException",
    "ResourceNotFoundException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeEntitlements-property
  getById: {
    method: "describeEntitlements",
    getField: "Entitlements",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeEntitlements-property
  getList: {
    method: "describeEntitlements",
    getParam: "Entitlements",
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Stack", group: "AppStream" },
          pickKey: pipe([({ Name }) => ({ StackName: Name })]),
          method: "describeEntitlements",
          getParam: "Entitlements",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#createEntitlement-property
  create: {
    method: "createEntitlement",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#updateEntitlement-property
  update: {
    method: "updateEntitlement",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#deleteEntitlement-property
  destroy: {
    method: "deleteEntitlement",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { stack },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(stack);
      }),
      () => otherProps,
      defaultsDeep({ StackName: stack.config.Name }),
    ])(),
});
