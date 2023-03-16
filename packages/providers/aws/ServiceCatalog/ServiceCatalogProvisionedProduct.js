const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

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
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogProvisionedProduct = () => ({
  type: "ProvisionedProduct",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: [
    "Id",
    "Status",
    "StatusMessage",
    "CreatedTime",
    "IdempotencyToken",
    "LastRecordId",
    "LastProvisioningRecordId",
    "LastSuccessfulProvisioningRecordId",
    "PhysicalId",
    "ProductId",
    "ProductName",
    "ProvisioningArtifactId",
    "UserArn",
    "UserArnSession",
    "NotificationArns",
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
      get("Id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
    provisioningArtifact: {
      type: "ProvisioningArtifact",
      group: "ServiceCatalog",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ProvisioningArtifactId"),
          tap((ProvisioningArtifactId) => {
            assert(ProvisioningArtifactId);
          }),
        ]),
    },
    snsTopics: {
      type: "Topic",
      group: "SNS",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("NotificationArns")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#describeProvisionedProduct-property
  getById: {
    method: "describeProvisionedProduct",
    getField: "ProvisionedProductDetail",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#searchProvisionedProducts-property
  getList: {
    method: "searchProvisionedProducts",
    getParam: "ProvisionedProducts",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#provisionProduct-property
  create: {
    method: "provisionProduct",
    pickCreated: ({ payload }) => pipe([get("RecordDetail")]),
    isInstanceUp: pipe([eq(get("Status"), "AVAILABLE")]),
    isInstanceError: pipe([eq(get("Status"), "ERROR")]),
    getErrorMessage: get("StatusMessage", "ERROR"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#updateProvisionedProduct-property
  update: {
    method: "updateProvisionedProduct",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#terminateProvisionedProduct-property
  destroy: {
    method: "terminateProvisionedProduct",
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      ({ Id }) => ({ ProvisionedProductId: Id }),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { product, provisioningArtifact, snsTopics },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(product);
        assert(provisioningArtifact);
        assert(snsTopics);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        ProductId: getField(product, "Id"),
        ProvisioningArtifactId: getField(provisioningArtifact, "Id"),
      }),
      when(
        () => snsTopics,
        assign({
          NotificationArns: pipe([
            () => snsTopics,
            map((snsTopic) => getField(snsTopic, "Attributes.TopicArn")),
          ]),
        })
      ),
    ])(),
});
