const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const filterPayload = (CostAllocationTagsStatus) => ({
  CostAllocationTagsStatus: [CostAllocationTagsStatus],
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html
exports.CostExplorerCostAllocationTag = () => ({
  type: "CostAllocationTag",
  package: "cost-explorer",
  client: "CostExplorer",
  propertiesDefault: { Status: "Active" },
  omitProperties: ["Type"],
  inferName: () =>
    pipe([
      get("TagKey"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("TagKey"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("TagKey"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#listCostAllocationTags-property
  getById: {
    method: "listCostAllocationTags",
    pickId: pipe([
      () => ({
        //
        Type: "UserDefined",
        Status: "Active",
      }),
    ]),
    decorate: ({ live }) =>
      pipe([get("CostAllocationTags"), find(eq(get("TagKey"), live.TagKey))]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#listCostAllocationTags-property
  getList: {
    enhanceParams: () => () => ({
      //
      Status: "Active",
      Type: "UserDefined",
    }),
    method: "listCostAllocationTags",
    getParam: "CostAllocationTags",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#updateCostAllocationTagsStatus-property
  create: {
    filterPayload,
    method: "updateCostAllocationTagsStatus",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#updateCostAllocationTagsStatus-property
  update: {
    method: "updateCostAllocationTagsStatus",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#updateCostAllocationTagsStatus-property
  destroy: {
    method: "updateCostAllocationTagsStatus",
    pickId: pipe([
      tap(({ TagKey }) => {
        assert(TagKey);
      }),
      ({ TagKey }) => ({
        CostAllocationTagsStatus: [{ TagKey, Status: "Inactive" }],
      }),
    ]),
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
