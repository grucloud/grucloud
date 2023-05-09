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
  tap(({ PolicyName, GroupName }) => {
    assert(PolicyName);
    assert(GroupName);
  }),
  pick(["PolicyName", "GroupName"]),
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
  tap(({ PolicyDocument }) => {
    assert(PolicyDocument);
  }),
  assign({ PolicyDocument: pipe([get("PolicyDocument"), JSON.stringify]) }),
]);

const findName =
  ({ lives, config }) =>
  ({ GroupName, PolicyName }) =>
    pipe([
      tap(() => {
        assert(GroupName);
        assert(PolicyName);
      }),
      () => `${GroupName}::${PolicyName}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.IAMGroupPolicy = () => ({
  type: "GroupPolicy",
  package: "iam",
  client: "IAM",
  propertiesDefault: {},
  omitProperties: ["GroupName"],
  inferName:
    ({ dependenciesSpec: { group } }) =>
    ({ PolicyName }) =>
      pipe([
        tap((name) => {
          assert(group);
          assert(PolicyName);
        }),
        () => `${group}::${PolicyName}`,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes,
  dependencies: {
    group: {
      type: "Group",
      group: "IAM",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("GroupName"),
          lives.getByName({
            type: "Group",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getGroupPolicy-property
  getById: {
    method: "getGroupPolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listGroupPolicies-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Group", group: "IAM" },
          pickKey: pipe([
            pick(["GroupName"]),
            tap(({ GroupName }) => {
              assert(GroupName);
            }),
          ]),
          method: "listGroupPolicies",
          getParam: "PolicyNames",
          config,
          decorate: ({ parent }) =>
            pipe([
              (PolicyName) => ({ PolicyName, GroupName: parent.GroupName }),
              tap(({ GroupName }) => {
                assert(GroupName);
              }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#putGroupPolicy-property
  create: {
    filterPayload,
    method: "putGroupPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#putGroupPolicy-property
  update: {
    method: "putGroupPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteGroupPolicy-property
  destroy: {
    method: "deleteGroupPolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { group },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(group);
        assert(otherProps.PolicyDocument);
        assert(otherProps.PolicyName);
      }),
      () => otherProps,
      defaultsDeep({
        GroupName: getField(group, "GroupName"),
      }),
    ])(),
});
