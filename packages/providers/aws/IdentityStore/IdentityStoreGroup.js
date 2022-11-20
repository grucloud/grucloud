const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ IdentityStoreId, GroupId }) => {
    assert(IdentityStoreId);
    assert(GroupId);
  }),
  pick(["IdentityStoreId", "GroupId"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
    defaultsDeep({ InstanceArn: live.InstanceArn }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html
exports.IdentityStoreGroup = ({}) => ({
  type: "Group",
  propertiesDefault: {},
  omitProperties: ["GroupId", "IdentityStoreId", "InstanceArn"],
  inferName: pipe([
    get("properties.DisplayName"),
    tap((GroupName) => {
      assert(GroupName);
    }),
  ]),
  findName: () =>
    pipe([
      get("DisplayName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("GroupId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    identityStore: {
      type: "Instance",
      group: "SSOAdmin",
      parent: true,
      //excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("InstanceArn"),
          tap((InstanceArn) => {
            assert(InstanceArn);
          }),
        ]),
    },
  },
  package: "identitystore",
  client: "Identitystore",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#describeGroup-property
  getById: {
    method: "describeGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#listGroups-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#createGroup-property
  create: {
    method: "createGroup",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#updateGroup-property
  update: {
    method: "updateGroup",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#deleteGroup-property
  destroy: {
    method: "deleteGroup",
    pickId,
  },
  getByName: getByNameCore,
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Instance", group: "SSOAdmin" },
          pickKey: pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["IdentityStoreId", "InstanceArn"]),
          ]),
          method: "listGroups",
          getParam: "Groups",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent);
              }),
              defaultsDeep({ InstanceArn: parent.InstanceArn }),
            ]),
        }),
    ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { identityStore },
  }) =>
    pipe([
      tap((params) => {
        assert(identityStore);
      }),
      () => otherProps,
      defaultsDeep({
        IdentityStoreId: getField(identityStore, "IdentityStoreId"),
      }),
    ])(),
});
