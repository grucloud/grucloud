const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogTagOption = () => ({
  type: "TagOption",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: { Active: true },
  omitProperties: ["Id", "Owner"],
  inferName: () =>
    pipe([
      get("Key"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Key"),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#getTagOption-property
  getById: {
    method: "describeTagOption",
    getField: "TagOptionDetail",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listTagOptions-property
  getList: {
    method: "listTagOptions",
    getParam: "TagOptionDetails",
    decorate,
    ignoreErrorCodes: ["TagOptionNotMigratedException"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#createTagOption-property
  create: {
    method: "createTagOption",
    pickCreated: ({ payload }) => pipe([get("TagOptionDetail")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#updateTagOption-property
  update: {
    method: "updateTagOption",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#deleteTagOption-property
  destroy: {
    method: "deleteTagOption",
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
