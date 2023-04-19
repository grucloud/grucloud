const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ UserPoolId, GroupName }) => {
    assert(UserPoolId);
    assert(GroupName);
  }),
  pick(["UserPoolId", "GroupName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(params);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.CognitoIdentityServiceProviderGroup = () => ({
  type: "Group",
  package: "cognito-identity-provider",
  client: "CognitoIdentityProvider",
  inferName: () =>
    pipe([
      get("PoolName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("PoolName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["RoleArn", "UserPoolId", "LastModifiedDate", "CreationDate"],
  propertiesDefault: {},
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
    userPool: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      parent: true,
      dependencyId: () =>
        pipe([
          get("UserPoolId"),
          tap((UserPoolId) => {
            assert(UserPoolId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#getGroup-property
  getById: {
    method: "getGroup",
    getField: "Group",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listGroups-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
          pickKey: pipe([pick(["UserPoolId"])]),
          method: "listGroups",
          getParam: "Groups",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createGroup-property
  create: {
    method: "createGroup",
    pickCreated: ({ payload }) => pipe([get("Group")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateGroup-property
  update: {
    method: "updateGroup",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteGroup-property
  destroy: {
    method: "deleteGroup",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { iamRole, userPool },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        UserPoolId: getField(userPool, "UserPoolId"),
      }),
      when(() => iamRole, defaultsDeep({ RoleArn: getField(iamRole, "Arn") })),
    ])(),
});
