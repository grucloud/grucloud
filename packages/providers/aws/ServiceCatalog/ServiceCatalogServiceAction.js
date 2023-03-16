const assert = require("assert");
const { pipe, tap, get, set, pick, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const filterPayload = pipe([
  when(
    get("Definition.Parameters"),
    set(
      "Definition.Parameters",
      pipe([get("Definition.Parameters"), JSON.stringify])
    )
  ),
]);

const parseParameter = pipe([
  when(
    get("Definition.Parameters"),
    set(
      "Definition.Parameters",
      pipe([get("Definition.Parameters"), JSON.parse])
    )
  ),
]);

const decorate =
  ({ endpoint, config }) =>
  ({ ServiceActionSummary, Definition, ...other }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
        assert(other);
      }),
      () => ({ ...ServiceActionSummary, Definition }),
      parseParameter,
      tap((params) => {
        assert(true);
      }),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogServiceAction = () => ({
  type: "ServiceAction",
  package: "service-catalog",
  client: "ServiceCatalog",
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
      tap((name) => {
        assert(name);
      }),
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
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#describeServiceAction-property
  getById: {
    method: "describeServiceAction",
    getField: "ServiceActionDetail",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listServiceActions-property
  getList: {
    method: "listServiceActions",
    getParam: "ServiceActionSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#createServiceAction-property
  create: {
    filterPayload,
    method: "createServiceAction",
    pickCreated: ({ payload }) =>
      pipe([get("ServiceActionDetail.ServiceActionSummary")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#updateServiceAction-property
  update: {
    method: "updateServiceAction",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#deleteServiceAction-property
  destroy: {
    method: "deleteServiceAction",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
