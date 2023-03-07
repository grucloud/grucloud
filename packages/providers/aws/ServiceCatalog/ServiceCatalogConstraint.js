const assert = require("assert");
const { pipe, tap, get, fork, assign, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
]);

const toConstraintId = ({ ConstraintId, ...other }) => ({
  Id: ConstraintId,
  ...other,
});

const filterPayload = pipe([
  assign({ Parameters: pipe([get("Parameters"), JSON.stringify]) }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogConstraint = () => ({
  type: "Constraint",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: [
    "PortfolioId",
    "ProductId",
    "Id",
    "Owner",
    "Status",
    "Parameters.RoleArn",
  ],
  inferName:
    ({ dependenciesSpec: { product, portfolio } }) =>
    ({ Type }) =>
      pipe([
        tap((params) => {
          assert(product);
          assert(portfolio);
          assert(Type);
        }),
        () => `${portfolio}::${product}::${Type}`,
      ])(),
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
        ({ portfolio, product }) => `${portfolio}::${product}::${live.Type}`,
      ])(),
  findId: () =>
    pipe([
      tap(({ PortfolioId, ProductId }) => {
        assert(PortfolioId);
        assert(ProductId);
      }),
      ({ PortfolioId, ProductId, Type }) =>
        `${PortfolioId}::${ProductId}::${Type}`,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidParametersException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("Parameters.RoleArn")]),
    },
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
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Description: pipe([
          get("Description"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#getProductPortfolioAssociation-property
  getById: {
    method: "describeConstraint",
    pickId,
    decorate:
      ({ live }) =>
      ({ ConstraintDetail, ConstraintParameters, Status }) =>
        pipe([
          () => ({
            ...ConstraintDetail,
            Status,
            Parameters: ConstraintParameters,
          }),
          toConstraintId,
          assign({ Parameters: pipe([get("Parameters"), JSON.parse]) }),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listPortfoliosForProduct-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Portfolio", group: "ServiceCatalog" },
          pickKey: pipe([
            tap(({ Id }) => {
              assert(Id);
            }),
            ({ Id }) => ({ PortfolioId: Id }),
          ]),
          method: "listConstraintsForPortfolio",
          getParam: "ConstraintDetails",
          config,
          decorate: ({ parent }) => pipe([toConstraintId, getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#createConstraint-property
  create: {
    filterPayload,
    method: "createConstraint",
    pickCreated: ({ payload }) =>
      pipe([get("ConstraintDetail"), toConstraintId]),
    shouldRetryOnExceptionCodes: ["ResourceNotFoundException"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#deleteConstraint-property
  destroy: {
    method: "deleteConstraint",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { iamRole, product, portfolio },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(product);
        assert(portfolio);
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        ProductId: getField(product, "Id"),
        PortfolioId: getField(portfolio, "Id"),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          Parameters: {
            RoleArn: getField(iamRole, "Arn"),
          },
        })
      ),
    ])(),
});
