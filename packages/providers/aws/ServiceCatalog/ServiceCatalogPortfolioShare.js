const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  fork,
  switchCase,
  flatMap,
  map,
} = require("rubico");
const { defaultsDeep, isEmpty, filterOut, find, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const decorate = ({}) =>
  pipe([
    ({ Type, PrincipalId, ...other }) => ({
      ...other,
      OrganizationNode: { Type, Value: PrincipalId },
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogPortfolioShare = () => ({
  type: "PortfolioShare",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: ["PortfolioId", "Accepted", "OrganizationNode.Value"],
  inferName: ({
    dependenciesSpec: { account, organisationalUnit, organisation, portfolio },
  }) =>
    pipe([
      tap((params) => {
        assert(portfolio);
      }),
      () => `${portfolio}::${account || organisationalUnit || organisation}`,
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
          principalName: pipe([
            tap(({ OrganizationNode }) => {
              assert(OrganizationNode.Type);
            }),
            switchCase([
              eq(get("OrganizationNode.Type"), "ACCOUNT"),
              pipe([
                get("OrganizationNode.Value"),
                lives.getById({
                  type: "Account",
                  group: "Organisations",
                  providerName: config.providerName,
                }),
                get("name", live.PrincipalId),
              ]),
              eq(get("OrganizationNode.Type"), "ORGANIZATIONAL_UNIT"),
              pipe([
                get("OrganizationNode.Value"),
                lives.getById({
                  type: "OrganisationalUnit",
                  group: "Organisations",
                  providerName: config.providerName,
                }),
                get("name", live.PrincipalId),
              ]),
              eq(get("OrganizationNode.Type"), "ORGANIZATION"),
              pipe([
                get("OrganizationNode.Value"),
                lives.getById({
                  type: "Organization",
                  group: "Organisations",
                  providerName: config.providerName,
                }),
                get("name", live.PrincipalId),
              ]),
              () => live.PrincipalId,
            ]),
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
        tap(({ portfolio, principalName }) => {
          assert(portfolio);
          assert(principalName);
        }),
        ({ portfolio, principalName }) => `${portfolio}::${principalName}`,
      ])(),
  findId: () =>
    pipe([
      tap(({ PortfolioId, OrganizationNode }) => {
        assert(PortfolioId);
        assert(OrganizationNode.Value);
      }),
      ({ PortfolioId, OrganizationNode }) =>
        `${PortfolioId}::${OrganizationNode.Value}`,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidParametersException"],
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("PrincipalId")]),
    },
    organisationalUnit: {
      type: "OrganisationalUnit",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("OrganizationNode.Value")]),
    },
    organization: {
      type: "Organization",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("OrganizationNode.Value")]),
    },
    portfolio: {
      type: "Portfolio",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("OrganizationNode.Value")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#describePortfolioShares-property
  getById: {
    method: "describePortfolioShares",
    pickId: pipe([
      ({ PortfolioId, OrganizationNode }) => ({
        PortfolioId,
        Type: OrganizationNode.Type,
      }),
      tap(({ PortfolioId, Type }) => {
        assert(PortfolioId);
        assert(Type);
      }),
    ]),
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.PortfolioId);
        }),
        get("PortfolioShareDetails"),
        find(eq(get("OrganizationNode.Value"), live.PrincipalId)),
        unless(
          isEmpty,
          pipe([
            defaultsDeep({ PortfolioId: live.PortfolioId }), //
            decorate({}),
            tap((params) => {
              assert(true);
            }),
          ])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listPortfoliosForProduct-property
  getList:
    ({ lives, client, endpoint, getById, config }) =>
    ({ lives }) =>
      pipe([
        lives.getByType({
          type: "Portfolio",
          group: "ServiceCatalog",
          providerName: config.providerName,
        }),
        flatMap(
          pipe([
            get("live"),
            tap(({ Id }) => {
              assert(Id);
            }),
            ({ Id }) =>
              pipe([
                () => [
                  "ACCOUNT",
                  "ORGANIZATION",
                  "ORGANIZATIONAL_UNIT",
                  "ORGANIZATION_MEMBER_ACCOUNT",
                ],
                flatMap(
                  pipe([
                    (Type) => ({ PortfolioId: Id, Type }),
                    endpoint().describePortfolioShares,
                    get("PortfolioShareDetails"),
                    map(
                      pipe([defaultsDeep({ PortfolioId: Id }), decorate({})])
                    ),
                  ])
                ),
              ])(),
          ])
        ),
        filterOut(isEmpty),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#createPortfolioShare-property
  create: {
    method: "createPortfolioShare",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#deletePortfolioShare-property
  destroy: {
    method: "deletePortfolioShare",
    pickId: pipe([
      tap(({ PortfolioId, OrganizationNode }) => {
        assert(PortfolioId, OrganizationNode);
      }),
      pick(["PortfolioId", "OrganizationNode"]),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { account, organisationalUnit, organisation, portfolio },
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
      defaultsDeep({
        OrganizationNode: {
          Value: getPrincipalId({ account, organisationalUnit, organisation }),
        },
      }),
    ])(),
});

const getPrincipalId = ({ account, organisationalUnit, organisation }) =>
  switchCase([
    () => account,
    () => getField(account, "Id"),
    () => organisationalUnit,
    () => getField(organisationalUnit, "Id"),
    () => organisation,
    () => getField(organisation, "Id"),
    () => {
      assert(false, "missing principal");
    },
  ])();
