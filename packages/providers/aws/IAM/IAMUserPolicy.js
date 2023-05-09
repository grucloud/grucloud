const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  ignoreErrorCodes,
  buildDependenciesPolicy,
  assignPolicyAccountAndRegion,
} = require("./IAMCommon");

const pickId = pipe([
  tap(({ PolicyName, UserName }) => {
    assert(PolicyName);
    assert(UserName);
  }),
  pick(["PolicyName", "UserName"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap(({ PolicyDocument }) => {
      assert(PolicyDocument);
    }),
    assign({
      PolicyDocument: pipe([
        get("PolicyDocument"),
        decodeURIComponent,
        JSON.parse,
      ]),
    }),
  ]);

const filterPayload = pipe([
  assign({ PolicyDocument: pipe([get("PolicyDocument"), JSON.stringify]) }),
]);

const findName =
  ({ lives, config }) =>
  ({ UserName, PolicyName }) =>
    pipe([
      tap(() => {
        assert(UserName);
        assert(PolicyName);
      }),
      () => `${UserName}::${PolicyName}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.IAMUserPolicy = () => ({
  type: "UserPolicy",
  package: "iam",
  client: "IAM",
  propertiesDefault: {},
  omitProperties: ["UserName"],
  inferName:
    ({ dependenciesSpec: { user } }) =>
    ({ PolicyName }) =>
      pipe([
        tap((name) => {
          assert(user);
          assert(PolicyName);
        }),
        () => `${user}::${PolicyName}`,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes,
  dependencies: {
    user: {
      type: "User",
      group: "IAM",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("UserName"),
          lives.getByName({
            type: "User",
            group: "IAM",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    ...buildDependenciesPolicy({ policyKey: "PolicyDocument" }),
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        PolicyDocument: pipe([
          get("PolicyDocument"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getUserPolicy-property
  getById: {
    method: "getUserPolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listUserPolicies-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "User", group: "IAM" },
          pickKey: pipe([
            pick(["UserName"]),
            tap(({ UserName }) => {
              assert(UserName);
            }),
          ]),
          method: "listUserPolicies",
          getParam: "PolicyNames",
          config,
          decorate: ({ parent }) =>
            pipe([
              (PolicyName) => ({ PolicyName, UserName: parent.UserName }),
              tap(({ UserName }) => {
                assert(UserName);
              }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#putUserPolicy-property
  create: {
    filterPayload,
    method: "putUserPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#putUserPolicy-property
  update: {
    method: "putUserPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUserPolicy-property
  destroy: {
    method: "deleteUserPolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { user },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(user);
        assert(otherProps.PolicyDocument);
        assert(otherProps.PolicyName);
      }),
      () => otherProps,
      defaultsDeep({
        UserName: getField(user, "UserName"),
      }),
    ])(),
});
