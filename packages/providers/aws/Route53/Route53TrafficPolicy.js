const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ Id, Version }) => {
    assert(Id);
    assert(Version);
  }),
  pick(["Id", "Version"]),
]);

const decorate = ({ endpoint }) =>
  pipe([assign({ Document: pipe([get("Document"), JSON.parse]) })]);

const filterPayload = pipe([
  assign({ Document: pipe([get("Document"), JSON.stringify]) }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53TrafficPolicy = () => ({
  type: "TrafficPolicy",
  package: "route-53",
  client: "Route53",
  propertiesDefault: {},
  omitProperties: ["Id", "Version"],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
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
  ignoreErrorCodes: ["NoSuchTrafficPolicy"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getTrafficPolicy-property
  getById: {
    method: "getTrafficPolicy",
    getField: "TrafficPolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listTrafficPolicies-property
  getList: {
    method: "listTrafficPolicies",
    getParam: "TrafficPolicySummaries",
    decorate: ({ getById }) =>
      pipe([
        ({ Id, LatestVersion }) => ({ Id, Version: LatestVersion }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createTrafficPolicy-property
  create: {
    filterPayload,
    method: "createTrafficPolicy",
    pickCreated: ({ payload }) => pipe([get("TrafficPolicy")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createTrafficPolicyVersion-property
  update:
    ({ endpoint, getById }) =>
    ({ payload, live, diff }) =>
      pipe([
        () => payload,
        filterPayload,
        defaultsDeep({ Id: live.Id }),
        endpoint().createTrafficPolicyVersion,
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteTrafficPolicy-property
  destroy: {
    method: "deleteTrafficPolicy",
    pickId,
    isInstanceDown: pipe([() => true]),
  },
  getByName: getByNameCore,
  configDefault: ({ properties: { Tags, ...otherProps }, dependencies: {} }) =>
    pipe([() => otherProps, defaultsDeep({})])(),
});
