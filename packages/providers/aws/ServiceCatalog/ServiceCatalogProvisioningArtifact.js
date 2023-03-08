const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const toProvisioningArtifactId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({
    ProvisioningArtifactId: Id,
  }),
]);

const pickId = pipe([
  tap(({ ProductId, ProvisioningArtifactId }) => {
    assert(ProductId);
    assert(ProvisioningArtifactId);
  }),
  pick(["ProductId", "ProvisioningArtifactId"]),
]);

const decorate =
  ({ endpoint, config, live }) =>
  ({
    ProvisioningArtifactDetail: { Name, Description, Type, ...other },
    Info,
    Status,
  }) =>
    pipe([
      tap((params) => {
        assert(Name);
        assert(Type);
        assert(endpoint);
        assert(live.ProductId);
      }),
      () => ({
        ...other,
        Status,
        Parameters: { Name, Description, Type, Info },
      }),
      defaultsDeep({ ProductId: live.ProductId }),
      toProvisioningArtifactId,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogProvisioningArtifact = () => ({
  type: "ProvisioningArtifact",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: [
    "ProductId",
    "ProvisioningArtifactId",
    "CreatedTime",
    "Status",
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
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    product: {
      type: "Product",
      group: "ServiceCatalog",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ProductId"),
          tap((ProductId) => {
            assert(ProductId);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#describeProvisioningArtifact-property
  getById: {
    method: "describeProvisioningArtifact",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listProvisioningArtifacts-property
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
          method: "listProvisioningArtifacts",
          getParam: "ProvisioningArtifactDetails",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(live.Id);
              }),
              defaultsDeep({ ProductId: live.Id }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#createProvisioningArtifact-property
  create: {
    method: "createProvisioningArtifact",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#updateProvisioningArtifact-property
  update: {
    method: "updateProvisioningArtifact",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#deleteProvisioningArtifact-property
  destroy: {
    method: "deleteProvisioningArtifact",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { product },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(product);
      }),
      () => otherProps,
      defaultsDeep({ ProductId: getField(product, "Id") }),
    ])(),
});
