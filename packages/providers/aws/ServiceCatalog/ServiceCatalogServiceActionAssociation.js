const assert = require("assert");
const { pipe, tap, get, pick, eq, fork } = require("rubico");
const { defaultsDeep, isEmpty, unless, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ProductId, ProvisioningArtifactId, ServiceActionId }) => {
    assert(ProductId);
    assert(ProvisioningArtifactId);
    assert(ServiceActionId);
  }),
  pick(["ProductId", "ProvisioningArtifactId", "ServiceActionId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ ProductViewSummary, ProvisioningArtifact, ServiceActionId }) => {
      assert(ProductViewSummary.ProductId);
      assert(ProvisioningArtifact.Id);
      assert(ServiceActionId);
    }),
    ({ ProductViewSummary, ProvisioningArtifact, ServiceActionId }) => ({
      ProductId: ProductViewSummary.ProductId,
      ProvisioningArtifactId: ProvisioningArtifact.Id,
      ServiceActionId,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogServiceActionAssociation = () => ({
  type: "ServiceActionAssociation",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: ["ServiceActionId", "ProductId", "ProvisioningArtifactId"],
  inferName: ({
    dependenciesSpec: { provisioningArtifact, product, serviceAction },
  }) =>
    pipe([
      tap((params) => {
        assert(serviceAction);
        assert(provisioningArtifact);
      }),
      () => `${serviceAction}::${provisioningArtifact}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          provisioningArtifact: pipe([
            get("ProvisioningArtifactId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "ProvisioningArtifact",
              group: "ServiceCatalog",
              providerName: config.providerName,
            }),
            get("name", live.ProvisioningArtifactId),
          ]),
          serviceAction: pipe([
            get("ServiceActionId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "ServiceAction",
              group: "ServiceCatalog",
              providerName: config.providerName,
            }),
            get("name", live.ServiceActionId),
          ]),
        }),
        tap(({ provisioningArtifact, serviceAction }) => {
          assert(provisioningArtifact);
          assert(serviceAction);
        }),
        ({ provisioningArtifact, serviceAction }) =>
          `${serviceAction}::${provisioningArtifact}`,
      ])(),
  findId: () =>
    pipe([
      tap(({ ServiceActionId, ProvisioningArtifactId }) => {
        assert(ServiceActionId);
        assert(ProvisioningArtifactId);
      }),
      ({ ServiceActionId, ProvisioningArtifactId }) =>
        `${ServiceActionId}::${ProvisioningArtifactId}`,
    ]),
  dependencies: {
    serviceAction: {
      type: "ServiceAction",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("ServiceActionId")]),
    },
    provisioningArtifact: {
      type: "ProvisioningArtifact",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ProvisioningArtifactId"),
          tap((ProvisioningArtifactId) => {
            assert(ProvisioningArtifactId);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#getServiceActionAssociation-property
  getById: {
    method: "listProvisioningArtifactsForServiceAction",
    decorate: ({ endpoint, config, live }) =>
      pipe([
        tap((params) => {
          assert(live.ServiceActionId);
          assert(live.ProvisioningArtifactId);
        }),
        get("ProvisioningArtifactViews"),
        find(eq(get("ProvisioningArtifact.Id"), live.ProvisioningArtifactId)),
        unless(
          isEmpty,
          pipe([
            defaultsDeep({ ServiceActionId: live.ServiceActionId }),
            decorate({ endpoint, config }),
          ])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listProvisioningArtifactsForServiceAction-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "ServiceAction", group: "ServiceCatalog" },
          pickKey: pipe([
            tap(({ Id }) => {
              assert(Id);
            }),
            ({ Id }) => ({ ServiceActionId: Id }),
          ]),
          method: "listProvisioningArtifactsForServiceAction",
          getParam: "ProvisioningArtifactViews",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.Id);
              }),
              defaultsDeep({ ServiceActionId: parent.Id }),
              decorate({ endpoint, config }),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#createServiceActionAssociation-property
  create: {
    method: "associateServiceActionWithProvisioningArtifact",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#deleteServiceActionAssociation-property
  destroy: {
    method: "disassociateServiceActionFromProvisioningArtifact",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { serviceAction, provisioningArtifact },
    config,
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(serviceAction);
        assert(provisioningArtifact);
      }),
      defaultsDeep({
        ProductId: getField(provisioningArtifact, "ProductId"),
        ProvisioningArtifactId: getField(
          provisioningArtifact,
          "ProvisioningArtifactId"
        ),
        ServiceActionId: getField(serviceAction, "Id"),
      }),
    ])(),
});
