const assert = require("assert");
const { pipe, tap, get, pick, eq, fork, switchCase } = require("rubico");
const { defaultsDeep, find, isEmpty, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ PortfolioId, PrincipalARN }) => {
    assert(PortfolioId);
    assert(PrincipalARN);
  }),
  pick(["PortfolioId", "PrincipalARN"]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogPrincipalPortfolioAssociation = () => ({
  type: "PrincipalPortfolioAssociation",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: ["PortfolioId", "PrincipalARN"],
  inferName: ({
    dependenciesSpec: {
      iamRole, //TODO other principal
      portfolio,
    },
  }) =>
    pipe([
      tap((params) => {
        assert(portfolio);
      }),
      // TODO
      () => `${portfolio}::${iamRole}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        tap((id) => {
          assert(id);
        }),
        fork({
          iamRole: pipe([
            get("PrincipalARN"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Role",
              group: "IAM",
              providerName: config.providerName,
            }),
            get("name", live.PrincipalARN),
          ]),
          portfolio: pipe([
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
        tap(({ portfolio }) => {
          assert(portfolio);
        }),
        // TODO other
        ({ portfolio, iamRole }) => `${portfolio}::${iamRole}`,
      ])(),
  findId: () =>
    pipe([
      tap(({ PortfolioId, PrincipalARN }) => {
        assert(PortfolioId);
        assert(PrincipalARN);
      }),
      ({ PortfolioId, PrincipalARN }) => `${PortfolioId}::${PrincipalARN}`,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidParametersException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("PrincipalARN")]),
    },
    portfolio: {
      type: "Portfolio",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("PortfolioId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#getPrincipalPortfolioAssociation-property
  getById: {
    method: "listPrincipalsForPortfolio",
    pickId,
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.PortfolioId);
        }),
        get("Principals"),
        find(eq(get("PrincipalARNs"), live.PrincipalARNs)),
        unless(
          isEmpty,
          pipe([defaultsDeep({ PortfolioId: live.PortfolioId })])
        ),
      ]),
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
          method: "listPrincipalsForPortfolio",
          getParam: "Principals",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.Id);
              }),
              defaultsDeep({ PortfolioId: parent.Id }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#associatePrincipalWithPortfolio-property
  create: {
    method: "associatePrincipalWithPortfolio",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#disassociatePrincipalFromPortfolio-property
  destroy: {
    method: "disassociatePrincipalFromPortfolio",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { iamRole, portfolio },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(portfolio);
      }),
      () => otherProps,
      defaultsDeep({
        PortfolioId: getField(portfolio, "Id"),
      }),
      switchCase([
        () => iamRole,
        defaultsDeep({ PrincipalARN: getField(iamRole, "Arn") }),
        () => {
          assert(false, "missing principal");
        },
      ]),
    ])(),
});
