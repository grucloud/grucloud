const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  switchCase,
  flatMap,
  map,
  fork,
  eq,
} = require("rubico");
const { defaultsDeep, filterOut, isEmpty, unless, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ BudgetName, ResourceId }) => {
    assert(BudgetName);
    assert(ResourceId);
  }),
  pick(["BudgetName", "ResourceId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listBudgetsForResource-property
const listBudgetsForResource = ({ endpoint, lives, config, type, group }) =>
  pipe([
    lives.getByType({
      type,
      group,
      providerName: config.providerName,
    }),
    flatMap(
      pipe([
        get("live"),
        ({ Id }) =>
          pipe([
            () => ({ ResourceId: Id }),
            endpoint().listBudgetsForResource,
            get("Budgets"),
            map(pipe([defaultsDeep({ ResourceId: Id }), decorate({})])),
          ])(),
      ])
    ),
    filterOut(isEmpty),
  ]);

const resourceId = ({ portfolio, product }) =>
  pipe([
    switchCase([
      () => portfolio,
      () => getField(portfolio, "Id"),
      () => product,
      () => getField(product, "Id"),
      () => {
        assert(false, "missing portfolio or product");
      },
      tap((ResourceId) => {
        assert(ResourceId);
      }),
    ]),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogBudgetResourceAssociation = () => ({
  type: "BudgetResourceAssociation",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: ["ResourceId"],
  inferName: () =>
    pipe([
      get("BudgetName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("BudgetName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      tap(({ BudgetName, ResourceId }) => {
        assert(BudgetName);
        assert(ResourceId);
      }),
      ({ BudgetName, ResourceId }) => `${BudgetName}::${ResourceId}`,
    ]),
  findId: () =>
    pipe([
      get("BudgetName"),
      tap((id) => {
        assert(id);
      }),
    ]),

  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#getBudgetResourceAssociation-property
  getById: {
    method: "listBudgetsForResource",
    pickId,
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.ResourceId);
        }),
        get("Budgets"),
        find(eq(get("BudgetName"), live.BudgetName)),
        unless(
          isEmpty,
          pipe([
            defaultsDeep({ ResourceId: live.ResourceId }), //
            decorate({}),
          ])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listBudgetResourceAssociations-property
  getList:
    ({ lives, client, endpoint, getById, config }) =>
    ({ lives }) =>
      pipe([
        fork({
          portfolios: listBudgetsForResource({
            endpoint,
            lives,
            config,
            type: "Portfolio",
            group: "ServiceCatalog",
          }),
          products: listBudgetsForResource({
            endpoint,
            lives,
            config,
            type: "Product",
            group: "ServiceCatalog",
          }),
        }),
        ({ portfolios = [], products = [] }) => [...portfolios, ...products],
        filterOut(isEmpty),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#associateBudgetWithResource-property
  create: {
    method: "associateBudgetWithResource",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#deleteBudgetResourceAssociation-property
  destroy: {
    method: "disassociateBudgetFromResource",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { portfolio, product },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({ ResourceId: resourceId({ portfolio, product }) }),
    ])(),
});
