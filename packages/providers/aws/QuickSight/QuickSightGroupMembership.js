const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ GroupName, MemberName }) => {
    assert(GroupName);
    assert(MemberName);
  }),
  pick(["GroupName", "MemberName", "Namespace", "AwsAccountId"]),
  defaultsDeep({ Namespace: "default" }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightGroupMembership = () => ({
  type: "GroupMembership",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: ["AwsAccountId", "MemberName", "GroupName"],
  inferName:
    ({ dependenciesSpec: { user, group } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(user);
          assert(group);
        }),
        () => `${group}::${user}`,
      ])(),
  findName:
    () =>
    ({ MemberName, GroupName }) =>
      pipe([
        tap((params) => {
          assert(MemberName);
          assert(GroupName);
        }),
        () => `${GroupName}::${MemberName}`,
      ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    user: {
      type: "User",
      group: "QuickSight",
      parent: true,
      dependencyId: () =>
        pipe([
          get("MemberName"),
          tap((name) => {
            assert(name);
          }),
        ]),
    },
    group: {
      type: "Group",
      group: "QuickSight",
      parent: true,
      dependencyId: () =>
        pipe([
          get("GroupName"),
          tap((name) => {
            assert(name);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#getGroupMembership-property
  getById: {
    method: "describeGroupMembership",
    getField: "GroupMember",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listGroupMemberships-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Group", group: "QuickSight" },
          pickKey: pipe([pick(["GroupName", "Namespace"])]),
          method: "listGroupMemberships",
          getParam: "GroupMemberList",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createGroupMembership-property
  create: {
    method: "createGroupMembership",
    pickCreated: ({ payload }) => pipe([get("GroupMember")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateGroupMembership-property
  update: {
    method: "updateGroupMembership",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteGroupMembership-property
  destroy: {
    method: "deleteGroupMembership",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { user, group },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(user);
        assert(group);
      }),
      () => otherProps,
      defaultsDeep({
        GroupName: user.config.GroupName,
        MemberName: user.config.UserName,
      }),
    ])(),
});
