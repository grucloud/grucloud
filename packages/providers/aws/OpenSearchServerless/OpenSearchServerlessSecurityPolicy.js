const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  flatMap,
  filter,
  not,
  tryCatch,
  map,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ name, type }) => {
    assert(name);
    assert(type);
  }),
  pick(["name", "type"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const filterPayload = pipe([
  tap((params) => {
    assert(true);
  }),
  assign({ policy: pipe([get("policy"), JSON.stringify]) }),
]);

const findName =
  () =>
  ({ name, type }) =>
    pipe([() => `${type}::${name}`])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html
exports.OpenSearchServerlessSecurityPolicy = ({ compare }) => ({
  type: "SecurityPolicy",
  package: "opensearchserverless",
  client: "OpenSearchServerless",
  propertiesDefault: {},
  omitProperties: ["id", "createdDate", "lastModifiedDate", "policyVersion"],
  inferName: findName,
  findName,
  findId: findName,
  dependencies: {},
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    vpcEndpoints: {
      type: "VpcEndpoint",
      group: "OpenSearchServerless",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("policy"), flatMap(get("SourceVPCEs.SourceVPCEs"))]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#getSecurityPolicy-property
  getById: {
    method: "getSecurityPolicy",
    getField: "securityPolicyDetail",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#listSecurityPolicies-property
  getList: ({ endpoint, getById }) =>
    pipe([
      () => ["encryption", "network"],
      flatMap(
        tryCatch(
          (type) =>
            pipe([
              () => ({
                type,
              }),
              endpoint().listSecurityPolicies,
              get("securityPolicySummaries"),
              map(pipe([getById({})])),
            ])(),
          (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
              () => undefined,
            ])()
        )
      ),
      filter(not(isEmpty)),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#createSecurityPolicy-property
  create: {
    filterPayload,
    method: "createSecurityPolicy",
    pickCreated: ({ payload }) => pipe([get("securityPolicyDetail")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#updateSecurityPolicy-property
  update: {
    method: "updateSecurityPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#deleteSecurityPolicy-property
  destroy: {
    method: "deleteSecurityPolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { tag, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => otherProps,
    ])(),
});
