const assert = require("assert");
const { pipe, tap, get, pick, eq, and, assign } = require("rubico");
const {
  defaultsDeep,
  append,
  find,
  callProp,
  isEmpty,
  unless,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const filterPayload = pipe([
  tap(({ PolicyDocument }) => {
    assert(PolicyDocument);
  }),
  assign({
    PolicyDocument: pipe([get("PolicyDocument"), JSON.stringify]),
  }),
]);

const pickId = pipe([
  tap(({ PolicyName, PolicyRevisionId }) => {
    assert(PolicyName);
  }),
  pick(["PolicyName", "PolicyRevisionId"]),
  tap((params) => {
    assert(true);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    tap(({ PolicyDocument }) => {
      assert(PolicyDocument);
    }),
    assign({ PolicyDocument: pipe([get("PolicyDocument"), JSON.parse]) }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html
exports.XRayResourcePolicy = () => ({
  type: "ResourcePolicy",
  package: "xray",
  client: "XRay",
  propertiesDefault: {},
  omitProperties: ["LastUpdatedTime", "PolicyRevisionId"],
  inferName: () =>
    pipe([
      get("PolicyName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () => (live) =>
    pipe([
      () => live,
      get("PolicyName"),
      tap((PolicyName) => {
        assert(PolicyName);
        assert(live.PolicyRevisionId);
      }),
      unless(() => live.Latest, append(`::${live.PolicyRevisionId}`)),
    ])(),
  findId:
    () =>
    ({ PolicyName, PolicyRevisionId }) =>
      pipe([
        tap(() => {
          assert(PolicyName);
          assert(PolicyRevisionId);
        }),
        () => `${PolicyName}::${PolicyRevisionId}`,
      ])(),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidPolicyRevisionIdException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#getResourcePolicy-property
  getById: {
    method: "listResourcePolicies",
    getField: "ResourcePolicies",
    pickId,
    decorate: ({ live, config }) =>
      pipe([
        get("ResourcePolicies"),
        find(
          and([
            //
            eq(get("PolicyName"), live.PolicyName),
            get("Latest"),
          ])
        ),
        unless(isEmpty, decorate({ config })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#listResourcePolicies-property
  getList: {
    method: "listResourcePolicies",
    getParam: "ResourcePolicies",
    transformListPost: () =>
      pipe([
        callProp("sort", (a, b) => b.PolicyRevisionId - a.PolicyRevisionId),
        unless(isEmpty, ([latestItem, ...others]) => [
          { ...latestItem, Latest: true },
          ...others,
        ]),
        callProp("reverse"),
      ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#putResourcePolicy-property
  create: {
    filterPayload,
    method: "putResourcePolicy",
    pickCreated: ({ payload }) => pipe([get("ResourcePolicy")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#putResourcePolicy-property
  update: {
    method: "putResourcePolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#deleteResourcePolicy-property
  destroy: {
    method: "deleteResourcePolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
