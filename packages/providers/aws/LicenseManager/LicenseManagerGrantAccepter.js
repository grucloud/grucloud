const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./LicenseManagerCommon");

const pickId = pipe([
  tap(({ GrantArn }) => {
    assert(GrantArn);
  }),
  pick(["GrantArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const cannotBeDeleted = () => () => true;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html
exports.LicenseManagerGrantAccepter = () => ({
  type: "GrantAccepter",
  package: "license-manager",
  client: "LicenseManager",
  propertiesDefault: {},
  omitProperties: [
    "LicenseArn",
    "ParentArn",
    "GrantStatus",
    "StatusReason",
    "GranteePrincipalArn",
    "HomeRegion",
    "Version",
    "GrantedOperations",
  ],
  inferName: ({ dependenciesSpec: {} }) =>
    pipe([
      get("GrantName"),
      tap((name) => {
        assert(name);
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
  cannotBeDeleted,
  dependencies: {
    grant: {
      type: "Grant",
      group: "LicenseManager",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("GrantArn"),
          tap((GrantArn) => {
            assert(GrantArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#listReceivedGrants-property
  getById: {
    method: "listReceivedGrants",
    getField: "Grants",
    pickId: pipe([
      tap(({ GrantArn }) => {
        assert(GrantArn);
      }),
      ({ GrantArn }) => ({ GrantArns: [GrantArn] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#listReceivedGrants-property
  getList: {
    method: "listReceivedGrants",
    getParam: "Grants",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#acceptGrant-property
  create: {
    method: "acceptGrant",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#rejectGrant-property
  destroy: {
    method: "rejectGrant",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { grant },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => grant,
        assign({ GrantArn: () => getField(grant, "GrantArn") })
      ),
    ])(),
});
