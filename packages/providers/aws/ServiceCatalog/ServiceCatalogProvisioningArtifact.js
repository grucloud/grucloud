const assert = require("assert");
const { pipe, tap, get, pick, fork, set } = require("rubico");
const { defaultsDeep, prepend, callProp, find, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const cannotBeDeleted = () => () => true;

const toProvisioningArtifactId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id, ...other }) => ({
    ProvisioningArtifactId: Id,
    ...other,
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
    Info: { TemplateUrl, ...otherInfo },
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
        Parameters: {
          Name,
          Description,
          Type,
          Info: { LoadTemplateFromURL: TemplateUrl, ...otherInfo },
        },
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
    "Active",
    "Guidance",
    "Parameters.Info.LoadTemplateFromURL",
  ],
  cannotBeDeleted,
  inferName: ({ dependenciesSpec: { product } }) =>
    pipe([
      tap((params) => {
        assert(product);
      }),
      get("Parameters.Name"),
      tap((Name) => {
        assert(Name);
      }),
      prepend("::"),
      prepend(product),
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          product: pipe([
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
          version: pipe([
            get("Parameters.Name"),
            tap((version) => {
              assert(version);
            }),
          ]),
        }),
        ({ product, version }) => `${product}::${version}`,
      ])(),
  findId: () =>
    pipe([
      get("ProvisioningArtifactId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    product: {
      type: "Product",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ProductId"),
          tap((ProductId) => {
            assert(ProductId);
          }),
        ]),
    },
    s3Template: {
      type: "Object",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Parameters.Info.LoadTemplateFromURL"),
          (LoadTemplateFromURL) =>
            pipe([
              lives.getByType({
                type: "Object",
                group: "S3",
                providerName: config.providerName,
              }),
              find(
                pipe([
                  get("live.signedUrl"),
                  callProp("startsWith", LoadTemplateFromURL),
                ])
              ),
              get("id"),
            ])(),
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
                assert(parent.Id);
              }),
              toProvisioningArtifactId,
              defaultsDeep({ ProductId: parent.Id }),
              getById({}),
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#createProvisioningArtifact-property
  create: {
    method: "createProvisioningArtifact",
    pickCreated: ({ payload }) =>
      pipe([
        tap((id) => {
          assert(id);
        }),
        get("ProvisioningArtifactDetail"),
        toProvisioningArtifactId,
        defaultsDeep({ ProductId: payload.ProductId }),
        tap((id) => {
          assert(id);
        }),
      ]),
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
    dependencies: { product, s3Template },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(product);
      }),
      () => otherProps,
      defaultsDeep({ ProductId: getField(product, "Id") }),
      when(
        () => s3Template?.live,
        pipe([
          set(
            "Parameters.Info.LoadTemplateFromURL",
            pipe([
              () => getField(s3Template, "signedUrl"),
              (url) =>
                pipe([
                  () => url,
                  callProp("replace", new URL(url).search, ""),
                ])(),
            ])
          ),
        ])
      ),
    ])(),
});
