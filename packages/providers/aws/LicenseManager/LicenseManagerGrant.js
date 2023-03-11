const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");
const { ignoreErrorCodes } = require("./LicenseManagerCommon");

const pickId = pipe([
  tap(({ GrantArn }) => {
    assert(GrantArn);
  }),
  pick(["GrantArn", "Version"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ GranteePrincipalArn, ...other }) => ({
      ...other,
      Principals: [GranteePrincipalArn],
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html
exports.LicenseManagerGrant = () => ({
  type: "Grant",
  package: "license-manager",
  client: "LicenseManager",
  propertiesDefault: {},
  omitProperties: [
    "LicenseArn",
    "GrantArn",
    "ParentArn",
    "GrantStatus",
    "StatusReason",
    "Version",
    "GrantedOperations",
  ],
  inferName: () =>
    pipe([
      get("GrantName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("GrantName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("GrantArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    license: {
      type: "License",
      group: "LicenseManager",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("LicenseArn"),
          tap((LicenseArn) => {
            assert(LicenseArn);
          }),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        HomeRegion: replaceAccountAndRegion({ lives, providerConfig }),
        Principals: pipe([
          get("Principals"),
          map(replaceAccountAndRegion({ lives, providerConfig })),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#getGrant-property
  getById: {
    method: "getGrant",
    getField: "Grant",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#listGrants-property
  getList: {
    method: "listDistributedGrants",
    getParam: "Grants",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#createGrant-property
  create: {
    method: "createGrant",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#updateGrant-property
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#deleteGrant-property
  destroy: {
    method: "deleteGrant",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { license },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(license);
      }),
      () => otherProps,
      defaultsDeep({ LicenseArn: getField(license, "LicenseArn") }),
    ])(),
});
