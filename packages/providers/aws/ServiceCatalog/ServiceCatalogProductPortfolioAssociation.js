const assert = require("assert");
const { pipe, tap, get, pick, eq, fork } = require("rubico");
const { defaultsDeep, find, isEmpty, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ PortfolioId, ProductId }) => {
    assert(PortfolioId);
    assert(ProductId);
  }),
  pick(["PortfolioId", "ProductId"]),
]);

const toPortfolioId = ({ Id, ...other }) => ({ PortfolioId: Id, ...other });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogProductPortfolioAssociation = () => ({
  type: "ProductPortfolioAssociation",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: ["PortfolioId", "ProductId"],
  inferName: ({ dependenciesSpec: { product, portfolio } }) =>
    pipe([
      tap((params) => {
        assert(product);
        assert(portfolio);
      }),
      () => `${portfolio}::${product}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        fork({
          product: pipe([
            () => live,
            get("ProductId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Product",
              group: "ServiceCatalog",
              providerName: config.providerName,
            }),
            get("name", live.ProductId),
          ]),
          portfolio: pipe([
            () => live,
            get("PortfolioId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Portfolio",
              group: "ServiceCatalog",
              providerName: config.providerName,
            }),
            get("name", live.PortfolioId),
          ]),
        }),
        tap(({ portfolio, product }) => {
          assert(portfolio);
          assert(product);
        }),
        ({ portfolio, product }) => `${portfolio}::${product}`,
      ])(),
  findId: () =>
    pipe([
      tap(({ PortfolioId, ProductId }) => {
        assert(PortfolioId);
        assert(ProductId);
      }),
      ({ PortfolioId, ProductId }) => `${PortfolioId}::${ProductId}`,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidParametersException"],
  dependencies: {
    portfolio: {
      type: "Portfolio",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("PortfolioId")]),
    },
    product: {
      type: "Product",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("ProductId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#getProductPortfolioAssociation-property
  getById: {
    method: "listPortfoliosForProduct",
    pickId,
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.PortfolioId);
        }),
        get("PortfolioDetails"),
        find(eq(get("Id"), live.PortfolioId)),
        unless(
          isEmpty,
          pipe([defaultsDeep({ ProductId: live.ProductId }), toPortfolioId])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listPortfoliosForProduct-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Product", group: "ServiceCatalog" },
          pickKey: pipe([
            tap(({ Id }) => {
              assert(Id);
            }),
            ({ Id }) => ({ ProductId: Id }),
          ]),
          method: "listPortfoliosForProduct",
          getParam: "PortfolioDetails",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.Id);
              }),
              ({ Id }) => ({ PortfolioId: Id, ProductId: parent.Id }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#associateProductWithPortfolio-property
  create: {
    method: "associateProductWithPortfolio",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#disassociateProductFromPortfolio-property
  destroy: {
    method: "disassociateProductFromPortfolio",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { product, portfolio },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(product);
        assert(portfolio);
      }),
      () => otherProps,
      defaultsDeep({
        ProductId: getField(product, "Id"),
        PortfolioId: getField(portfolio, "Id"),
      }),
    ])(),
});
