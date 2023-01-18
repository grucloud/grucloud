const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53DelegationSet = () => ({
  type: "DelegationSet",
  package: "route-53",
  client: "Route53",
  propertiesDefault: {},
  omitProperties: ["Id", "NameServers"],
  inferName: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("CallerReference"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("CallerReference"),
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
  ignoreErrorCodes: ["NoSuchDelegationSet"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getDelegationSet-property
  getById: {
    method: "getReusableDelegationSet",
    getField: "DelegationSet",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listReusableDelegationSets-property
  getList: {
    method: "listReusableDelegationSets",
    getParam: "DelegationSets",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createReusableDelegationSet-property
  create: {
    method: "createReusableDelegationSet",
    pickCreated: ({ payload }) => pipe([get("DelegationSet")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteReusableDelegationSet-property
  destroy: {
    method: "deleteReusableDelegationSet",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({ properties: { ...otherProps }, dependencies: {} }) =>
    pipe([() => otherProps, defaultsDeep({})])(),
});
