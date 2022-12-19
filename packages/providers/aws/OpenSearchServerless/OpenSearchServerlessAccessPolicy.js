const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const pickId = pipe([
  tap(({ name, type }) => {
    assert(name);
    assert(type);
  }),
  pick(["name", "type"]),
]);

const filterPayload = pipe([
  tap((params) => {
    assert(true);
  }),
  //assign({ policy: pipe([get("policy"), JSON.stringify]) }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    //assign({ policy: pipe([get("policy"), JSON.parse]) }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html
exports.OpenSearchServerlessAccessPolicy = () => ({
  type: "AccessPolicy",
  package: "opensearchserverless",
  client: "OpenSearchServerless",
  propertiesDefault: {},
  omitProperties: ["createdDate", "lastModifiedDate", "policyVersion"],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#getAccessPolicy-property
  getById: {
    method: "getAccessPolicy",
    getField: "accessPolicyDetail",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#listAccessPolicies-property
  getList: {
    enhanceParams: () => () => ({ type: "data" }),
    method: "listAccessPolicies",
    getParam: "accessPolicySummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#createAccessPolicy-property
  create: {
    filterPayload,
    method: "createAccessPolicy",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#updateAccessPolicy-property
  update: {
    method: "updateAccessPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(live.policyVersion);
        }),
        () => payload,
        defaultsDeep({ policyVersion: live.policyVersion }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#deleteAccessPolicy-property
  destroy: {
    method: "deleteAccessPolicy",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ name: name, type: "data" }), getById({})]),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps])(),
});
