const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ AssignmentName, AwsAccountId, Namespace }) => {
    assert(AssignmentName);
    assert(AwsAccountId);
    assert(Namespace);
  }),
  pick(["AssignmentName", "AwsAccountId", "Namespace"]),
]);

const decorate = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    defaultsDeep({ AwsAccountId: config.accountId(), Namespace: "default" }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightIAMPolicyAssignment = () => ({
  type: "IAMPolicyAssignment",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: [
    "AwsAccountId",
    "AssignmentId",
    "AssignmentStatus",
    "PolicyArn",
  ],
  inferName: () =>
    pipe([
      get("AssignmentName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("AssignmentName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("AssignmentId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    iamPolicy: {
      type: "Policy",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("PolicyArn"),
          tap((PolicyArn) => {
            assert(true);
          }),
        ]),
    },
    namespace: {
      type: "Namespace",
      group: "QuickSight",
      parent: true,
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Namespace"),
          tap((Namespace) => {
            assert(true);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeIAMPolicyAssignment-property
  getById: {
    method: "describeIAMPolicyAssignment",
    getField: "IAMPolicyAssignment",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listIAMPolicyAssignments-property
  // Loop through Namepsace
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId(), Namespace: "default" }),
    method: "listIAMPolicyAssignments",
    getParam: "IAMPolicyAssignments",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createIAMPolicyAssignment-property
  create: {
    method: "createIAMPolicyAssignment",
    pickCreated: ({ payload }) =>
      pipe([get("IAMPolicyAssignment"), defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateIAMPolicyAssignment-property
  update: {
    method: "updateIAMPolicyAssignment",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteIAMPolicyAssignment-property
  destroy: {
    method: "deleteIAMPolicyAssignment",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    properties: { Tags, ...otherProps },
    dependencies: { iamPolicy, namespace },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
      }),
      when(
        () => iamPolicy,
        defaultsDeep({ PolicyArn: getField(iamPolicy, "Arn") })
      ),
      // TODO test: is it Namespace ?
      when(
        () => namespace,
        defaultsDeep({ Namespace: namespace.config.Namespace })
      ),
    ])(),
});
