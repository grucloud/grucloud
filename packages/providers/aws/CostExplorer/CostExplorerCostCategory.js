const assert = require("assert");
const { pipe, tap, get, pick, flatMap, assign, map } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");

const { assignTags } = require("./CostExplorerCommon");

const buildArn = () =>
  pipe([
    get("CostCategoryArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ CostCategoryArn }) => {
    assert(CostCategoryArn);
  }),
  pick(["CostCategoryArn"]),
]);

const decorate = ({ endpoint }) => pipe([assignTags({ buildArn, endpoint })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html
exports.CostExplorerCostCategory = () => ({
  type: "CostCategory",
  package: "cost-explorer",
  client: "CostExplorer",
  propertiesDefault: {},
  omitProperties: [
    "CostCategoryArn",
    "ProcessingStatus",
    "NumberOfRules",
    "ProcessingStatus",
  ],
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
      get("CostCategoryArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    accounts: {
      type: "Account",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Rules"),
          flatMap(get("Rule.Dimensions.Values")),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Rules: pipe([
          get("Rules"),
          map(
            assign({
              Rule: pipe([
                get("Rule"),
                assign({
                  Dimensions: pipe([
                    get("Dimensions"),
                    assign({
                      Values: pipe([
                        get("Values"),
                        map(
                          replaceWithName({
                            groupType: "Organisations::Account",
                            path: "id",
                            providerConfig,
                            lives,
                          })
                        ),
                      ]),
                    }),
                  ]),
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#getCostCategory-property
  getById: {
    method: "describeCostCategoryDefinition",
    getField: "CostCategory",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#listCostCategorys-property
  getList: {
    method: "listCostCategoryDefinitions",
    getParam: "CostCategoryReferences",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#createCostCategory-property
  create: {
    method: "createCostCategoryDefinition",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#updateCostCategory-property
  update: {
    method: "updateCostCategory",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#deleteCostCategory-property
  destroy: {
    method: "deleteCostCategoryDefinition",
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
