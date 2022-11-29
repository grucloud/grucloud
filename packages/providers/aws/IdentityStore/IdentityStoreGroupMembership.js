const assert = require("assert");
const { pipe, tap, get, pick, fork } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ MembershipId, IdentityStoreId }) => {
    assert(MembershipId);
    assert(IdentityStoreId);
  }),
  pick(["MembershipId", "IdentityStoreId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html
exports.IdentityStoreGroupMembership = ({ compare }) => ({
  type: "GroupMembership",
  package: "identitystore",
  client: "Identitystore",
  propertiesDefault: {},
  omitProperties: [
    "GroupId",
    "IdentityStoreId",
    "InstanceArn",
    "MembershipId",
    "MemberId",
  ],
  inferName:
    ({ dependenciesSpec: { group, user } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(group);
          assert(user);
        }),
        () => `membership::${group}::${user}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          group: pipe([
            get("GroupId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Group",
              group: "IdentityStore",
            }),
            get("name"),
          ]),
          user: pipe([
            get("MemberId.UserId"),
            tap((id) => {
              assert(id);
            }),
            (id) =>
              pipe([
                () => id,
                lives.getById({
                  type: "User",
                  group: "IdentityStore",
                  providerName: config.providerName,
                }),
                get("name", id),
              ])(),
          ]),
        }),
        tap(({ group, user }) => {
          assert(group);
          assert(user);
        }),
        ({ group, user }) => `membership::${group}::${user}`,
      ])(),
  findId: () =>
    pipe([
      get("MembershipId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    identityStore: {
      type: "Instance",
      group: "SSOAdmin",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("InstanceArn"),
          tap((InstanceArn) => {
            assert(InstanceArn);
          }),
        ]),
    },
    group: {
      type: "Group",
      group: "IdentityStore",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("GroupId"),
          tap((GroupId) => {
            assert(GroupId);
          }),
        ]),
    },
    user: {
      type: "User",
      group: "IdentityStore",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("MemberId.UserId"),
          tap((UserId) => {
            assert(UserId);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#getGroupMembership-property
  getById: {
    method: "describeGroupMembership",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#listGroupMemberships-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Group", group: "IdentityStore" },
          pickKey: pipe([pick(["GroupId", "IdentityStoreId"])]),
          method: "listGroupMemberships",
          getParam: "GroupMemberships",
          config,
          decorate: ({ parent }) =>
            pipe([defaultsDeep({ InstanceArn: parent.InstanceArn })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#createGroupMembership-property
  create: {
    method: "createGroupMembership",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IdentityStore.html#deleteGroupMembership-property
  destroy: {
    method: "deleteGroupMembership",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { identityStore, user, group },
  }) =>
    pipe([
      tap((params) => {
        assert(identityStore);
        assert(group);
        assert(user);
      }),
      () => otherProps,
      defaultsDeep({
        IdentityStoreId: getField(identityStore, "IdentityStoreId"),
        GroupId: getField(group, "GroupId"),
        MemberId: { UserId: getField(user, "UserId") },
      }),
    ])(),
});
