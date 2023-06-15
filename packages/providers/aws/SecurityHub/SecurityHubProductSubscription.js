const assert = require("assert");
const { pipe, tap, get, assign, pick, eq, fork, map } = require("rubico");
const {
  defaultsDeep,
  find,
  identity,
  unless,
  isEmpty,
  callProp,
  last,
  prepend,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { replaceAccountAndRegion } = require("../AwsCommon");
const { ignoreErrorCodes } = require("./SecurityHubCommon");

const subscriptionToProduct = ({ config }) =>
  pipe([
    callProp("split", "product-subscription/"),
    last,
    prepend(`arn:${config.partition}:securityhub:${config.region}::product/`),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubProductSubscription = () => ({
  type: "ProductSubscription",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: {},
  omitProperties: ["ProductSubscriptionArn"],
  inferName: () =>
    pipe([
      get("ProductArn"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ProductArn"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ProductArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    securityHubAccount: {
      type: "Account",
      group: "SecurityHub",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
  },
  ignoreErrorCodes,
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        ProductArn: pipe([
          get("ProductArn"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#getProductSubscription-property
  getById: {
    method: "listEnabledProductsForImport",
    pickId: () => ({}),
    decorate: ({ live: { ProductArn }, config }) =>
      pipe([
        tap((params) => {
          assert(ProductArn);
          assert(config);
        }),
        get("ProductSubscriptions"),
        map(subscriptionToProduct({ config })),
        find(eq(identity, ProductArn)),
        unless(isEmpty, (ProductArn) => ({ ProductArn })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#listEnabledProductsForImport-property
  getList: {
    method: "listEnabledProductsForImport",
    getParam: "ProductSubscriptions",
    decorate: ({ config }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),

        fork({
          ProductArn: subscriptionToProduct({ config }),
          ProductSubscriptionArn: identity,
        }),
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#enableImportFindingsForProduct-property
  create: {
    method: "enableImportFindingsForProduct",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#disableImportFindingsForProduct-property
  destroy: {
    method: "disableImportFindingsForProduct",
    pickId: pipe([
      tap(({ ProductSubscriptionArn }) => {
        assert(ProductSubscriptionArn);
      }),
      pick(["ProductSubscriptionArn"]),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
