const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ LicenseArn }) => {
    assert(LicenseArn);
  }),
  pick(["LicenseArn", "SourceVersion"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html
exports.LicenseManagerLicense = () => ({
  type: "License",
  package: "license-manager",
  client: "LicenseManager",
  propertiesDefault: {},
  omitProperties: ["Issuer", "Status", "CreateTime", "Version"],
  inferName: () =>
    pipe([
      get("LicenseName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("LicenseName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("LicenseArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#getLicense-property
  getById: {
    method: "getLicense",
    getField: "License",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#listLicenses-property
  getList: {
    method: "listLicenses",
    getParam: "Licenses",
    decorate: ({ getById }) =>
      pipe([
        tap((id) => {
          assert(id);
        }),
        getById,
        tap((id) => {
          assert(id);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#createLicense-property
  create: {
    method: "createLicense",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#updateLicense-property
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#deleteLicense-property
  destroy: {
    method: "deleteLicense",
    pickId,
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
