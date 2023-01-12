const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./FMSCommon");

const buildArn = () =>
  pipe([
    get("PolicyArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ PolicyId }) => {
    assert(PolicyId);
  }),
  pick(["PolicyId"]),
]);

const filterPayload = ({ Tags, ...other }) =>
  pipe([
    () => other,
    assign({
      SecurityServicePolicyData: pipe([
        get("SecurityServicePolicyData"),
        assign({
          ManagedServiceData: pipe([get("ManagedServiceData"), JSON.stringify]),
        }),
      ]),
    }),
    (Policy) => ({
      Policy,
      TagList: Tags,
    }),
  ])();

const decorate = ({ endpoint, config }) =>
  pipe([
    ({ Policy, PolicyArn }) => ({ PolicyArn, ...Policy }),
    assignTags({ buildArn: buildArn(), endpoint }),
    assign({
      SecurityServicePolicyData: pipe([
        get("SecurityServicePolicyData"),
        assign({
          ManagedServiceData: pipe([get("ManagedServiceData"), JSON.parse]),
        }),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html
exports.FMSPolicy = () => ({
  type: "Policy",
  package: "fms",
  client: "FMS",
  propertiesDefault: {},
  omitProperties: ["PolicyId", "PolicyArn", "PolicyUpdateToken"],
  inferName: () =>
    pipe([
      get("PolicyName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("PolicyName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("PolicyId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    adminAccount: {
      type: "AdminAccount",
      group: "FMS",
      dependsOnTypeOnly: true,
    },
    accountsInclude: {
      type: "Account",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("IncludeMap.ACCOUNT")]),
    },
    organisationalUnitsInclude: {
      type: "OrganisationalUnit",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("IncludeMap.ORG_UNIT")]),
    },
    accountsExclude: {
      type: "Account",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("ExcludeMap.ACCOUNT")]),
    },
    organisationalExclude: {
      type: "OrganisationalUnit",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("ExcludeMap.ORG_UNIT")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#getPolicy-property
  getById: {
    method: "getPolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#listPolicies-property
  getList: {
    method: "listPolicies",
    getParam: "PolicyList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#putPolicy-property
  create: {
    filterPayload: filterPayload,
    method: "putPolicy",
    pickCreated: ({ payload }) => pipe([get("Policy")]),
  },
  update: {
    method: "putPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(live.PolicyUpdateToken);
        }),
        () => payload,
        defaultsDeep(pickId(live)),
        defaultsDeep({ PolicyUpdateToken: live.PolicyUpdateToken }),
        filterPayload,
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#deletePolicy-property
  destroy: {
    method: "deletePolicy",
    pickId: pipe([pickId, defaultsDeep({ DeleteAllPolicyResources: true })]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
