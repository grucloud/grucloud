const assert = require("assert");
const { pipe, tap, eq, get, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  () => ({}),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName = () => pipe([() => "default"]);

const isDisabled = eq(get("Status"), "DISABLED");

const cannotBeDeleted = () => pipe([isDisabled]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerServiceCatalogPortfolio = () => ({
  type: "ServiceCatalogPortfolio",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [],
  inferName: findName,
  findName,
  findId: findName,
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#getServicecatalogPortfolio-property
  getById: {
    method: "getSagemakerServicecatalogPortfolioStatus",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#getSagemakerServicecatalogPortfolioStatus-property
  getList: {
    method: "getSagemakerServicecatalogPortfolioStatus",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createServicecatalogPortfolio-property
  create: {
    method: "enableSagemakerServicecatalogPortfolio",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateServicecatalogPortfolio-property
  update:
    ({ endpoint, getById }) =>
    ({ payload, live, diff }) =>
      pipe([
        () => payload,
        switchCase([
          isDisabled,
          endpoint().enableSagemakerServicecatalogPortfolio,
          endpoint().disableSagemakerServicecatalogPortfolio,
        ]),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#disableSagemakerServicecatalogPortfolio-property
  destroy: {
    method: "disableSagemakerServicecatalogPortfolio",
    pickId,
    isInstanceDown: () => true,
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
