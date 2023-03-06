const assert = require("assert");
const { pipe, tap, get, pick, omit, assign } = require("rubico");
const { defaultsDeep, first, find, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { assignDiffTags } = require("./ServiceCatalogCommon");

//
const productIdToId = ({ ProductId, Id, ...other }) => ({
  ...other,
  Id: ProductId,
});

const toProductType = ({ Type, ...other }) => ({
  ...other,
  ProductType: Type,
});

const toDescription = ({ ShortDescription, ...other }) => ({
  ...other,
  Description: ShortDescription,
});

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),

    ({
      ProductViewDetail,
      ProvisioningArtifactSummaries,
      Tags,
      TagsOptions,
      Budgets,
    }) => ({
      ...ProductViewDetail.ProductViewSummary,
      ProvisioningArtifactSummaries,
      Tags,
      TagsOptions,
      // Budgets, TODO
    }),
    assign({
      ProvisioningArtifactParameters: ({
        ProductId,
        ProvisioningArtifactSummaries,
      }) =>
        pipe([
          () => ProvisioningArtifactSummaries,
          first,
          tap(({ Id }) => {
            assert(Id);
            assert(ProductId);
          }),
          ({ Id }) => ({ ProductId, ProvisioningArtifactId: Id }),
          endpoint().describeProvisioningArtifact,
          ({ Info, ProvisioningArtifactDetail }) => ({
            ...pick(["Name", "Description", "Type", "SourceRevision"])(
              ProvisioningArtifactDetail
            ),
            Info: { LoadTemplateFromURL: Info.TemplateUrl },
          }),
        ])(),
    }),
    omit(["ProvisioningArtifactSummaries"]),
    toDescription,
    toProductType,
    productIdToId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogProduct = () => ({
  type: "Product",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: ["Id", "ARN", "CreatedTime", "ProductId", "HasDefaultPath"],
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
      get("Id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    s3Template: {
      type: "Object",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ProvisioningArtifactParameters.Info.LoadTemplateFromURL"),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#describeProductAsAdmin-property
  getById: {
    method: "describeProductAsAdmin",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#searchProductsAsAdmin-property
  getList: {
    method: "searchProductsAsAdmin",
    getParam: "ProductViewDetails",
    decorate: ({ getById }) =>
      pipe([get("ProductViewSummary"), productIdToId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#createProduct-property
  create: {
    method: "createProduct",
    pickCreated: ({ payload }) =>
      pipe([get("ProductViewDetail.ProductViewSummary"), productIdToId]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#updateProduct-property
  update: {
    method: "updateProduct",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        omit(["Tags", "Type"]),
        assignDiffTags({ diff }),
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#de leteProduct-property
  destroy: {
    method: "deleteProduct",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
