const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, ignoreErrorCodes } = require("./LicenseManagerCommon");

const buildArn = () =>
  pipe([
    get("LicenseConfigurationArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ LicenseConfigurationArn }) => {
    assert(LicenseConfigurationArn);
  }),
  pick(["LicenseConfigurationArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html
exports.LicenseManagerLicenseConfiguration = () => ({
  type: "LicenseConfiguration",
  package: "license-manager",
  client: "LicenseManager",
  propertiesDefault: {},
  omitProperties: [
    "LicenseConfigurationArn",
    "LicenseConfigurationId",
    "ConsumedLicenses",
    "Status",
    "OwnerAccountId",
    "ManagedResourceSummaryList",
    "ConsumedLicenseSummaryList",
    "AutomatedDiscoveryInformation",
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
      get("LicenseConfigurationArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#getLicenseConfiguration-property
  getById: {
    method: "getLicenseConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#listLicenseConfigurations-property
  getList: {
    method: "listLicenseConfigurations",
    getParam: "LicenseConfigurations",
    decorate: ({ getById }) =>
      pipe([
        tap((id) => {
          assert(id);
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#createLicenseConfiguration-property
  create: {
    method: "createLicenseConfiguration",
    pickCreated: ({ payload }) => pipe([identity]),
    // isInstanceUp: pipe([get("Status"), isIn(["RUNNING"])]),
    // isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
    // getErrorMessage: pipe([get("StateChangeReason.Message", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#updateLicenseConfiguration-property
  update: {
    method: "updateLicenseConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#deleteLicenseConfiguration-property
  destroy: {
    method: "deleteLicenseConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
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
